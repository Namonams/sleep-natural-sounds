/**
 * sync_stats.js — Pull YouTube stats + Analytics → dashboard/yt_stats.json
 * Tourne via Windows Task Scheduler toutes les heures
 */
const { google } = require('googleapis');
const fs   = require('fs');
const path = require('path');
const http = require('http');
const url  = require('url');

const ROOT         = path.join(__dirname, '..');
const SECRETS_FILE = path.join(__dirname, 'client_secrets.json');
const TOKEN_FILE   = path.join(__dirname, '.yt_token.json');
const OUTPUT_FILE  = path.join(ROOT, 'dashboard', 'yt_stats.json');
const LOG_FILE     = path.join(__dirname, 'sync_stats.log');

const SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube',
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/yt-analytics.readonly'
];

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

async function getAuth() {
  const secrets = JSON.parse(fs.readFileSync(SECRETS_FILE));
  const { client_id, client_secret } = secrets.installed || secrets.web;
  const oauth2 = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:8080');

  if (fs.existsSync(TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_FILE));
    oauth2.setCredentials(token);
    try {
      const { credentials } = await oauth2.refreshAccessToken();
      fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials));
      oauth2.setCredentials(credentials);
      return oauth2;
    } catch(e) {
      log(`Token refresh échoué: ${e.message}`);
      fs.unlinkSync(TOKEN_FILE);
      if (process.env.GITHUB_ACTIONS) {
        log('ERREUR CI: token invalide. Relancer OAuth localement puis mettre à jour le secret YT_TOKEN.');
        process.exit(1);
      }
    }
  }

  if (process.env.GITHUB_ACTIONS) {
    log('ERREUR CI: aucun token valide. OAuth interactif impossible en CI. Exécuter `node sync_stats.js` localement pour générer le token.');
    process.exit(1);
  }

  // OAuth2 flow (local uniquement)
  const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES, prompt: 'consent' });
  log('AUTORISATION REQUISE — ouvre ce lien:');
  log(authUrl);

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const qs = new url.URL(req.url, 'http://localhost:8080').searchParams;
      const code = qs.get('code');
      res.end('<h1>OK — retourne dans le terminal.</h1>');
      server.close();
      if (code) resolve(code); else reject(new Error('No code'));
    }).listen(8080);
  });

  const { tokens } = await oauth2.getToken(code);
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));
  oauth2.setCredentials(tokens);
  log('Token sauvé');
  return oauth2;
}

async function syncStats(auth) {
  const yt        = google.youtube({ version: 'v3', auth });
  const analytics = google.youtubeAnalytics({ version: 'v2', auth });

  // 1. Liste toutes les vidéos de la chaîne
  const channelRes = await yt.channels.list({ part: ['statistics','snippet'], mine: true });
  const channel    = channelRes.data.items[0];
  const channelId  = channel.id;
  const subsCount  = parseInt(channel.statistics.subscriberCount || 0);
  const totalViews = parseInt(channel.statistics.viewCount || 0);

  log(`Channel: ${channel.snippet.title} — ${subsCount} subs — ${totalViews} views`);

  // 2. Stats par vidéo
  const videosRes = await yt.search.list({
    part: ['snippet'], channelId, type: ['video'],
    order: 'date', maxResults: 20
  });

  const videoIds = videosRes.data.items.map(i => i.id.videoId).filter(Boolean);
  const videos   = [];

  if (videoIds.length > 0) {
    const statsRes = await yt.videos.list({
      part: ['statistics','snippet','status'],
      id: videoIds
    });

    for (const v of statsRes.data.items) {
      videos.push({
        id:          v.id,
        title:       v.snippet.title,
        publishedAt: v.snippet.publishedAt,
        status:      v.status.privacyStatus,
        views:       parseInt(v.statistics.viewCount || 0),
        likes:       parseInt(v.statistics.likeCount || 0),
        comments:    parseInt(v.statistics.commentCount || 0),
        thumbnail:   v.snippet.thumbnails?.medium?.url || ''
      });
    }
  }

  // 3. Analytics (watch time) — fallback gracieux si scope manquant
  let watchTimeHours = 0;
  try {
    const today     = new Date().toISOString().split('T')[0];
    const analyticsRes = await analytics.reports.query({
      ids: `channel==${channelId}`,
      startDate: '2026-01-01', endDate: today,
      metrics: 'estimatedMinutesWatched',
      dimensions: 'day'
    });
    if (analyticsRes.data.rows) {
      const totalMinutes = analyticsRes.data.rows.reduce((sum, row) => sum + (row[1] || 0), 0);
      watchTimeHours = Math.round(totalMinutes / 60);
    }
    log(`Analytics OK — ${watchTimeHours}h watch time`);
  } catch(e) {
    // Fallback: estimer depuis vues (11h avg pour sleep content)
    watchTimeHours = Math.round(totalViews * 0.5);
    log(`Analytics fallback (scope manquant?) — estimé ${watchTimeHours}h — erreur: ${e.message}`);
  }

  // 4. Écrire yt_stats.json
  const stats = {
    updatedAt:    new Date().toISOString(),
    channel: {
      subscribers: subsCount,
      totalViews,
      watchTimeHours,
      yppSubsTarget:   1000,
      yppHoursTarget:  4000
    },
    videos
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(stats, null, 2));
  log(`Stats écrites: ${subsCount} subs, ${watchTimeHours}h watch time, ${videos.length} vidéos`);
  return stats;
}

(async () => {
  try {
    log('=== SYNC START ===');
    const auth  = await getAuth();
    const stats = await syncStats(auth);
    log('=== SYNC OK ===');
  } catch(err) {
    log(`ERREUR: ${err.message}`);
    process.exit(1);
  }
})();

