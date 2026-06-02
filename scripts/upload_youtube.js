/**
 * upload_youtube.js - Upload vidéo 10h sur YouTube avec tous les paramètres
 * Usage: node upload_youtube.js
 * Prérequis: client_secrets.json dans ce dossier (Google Cloud Console OAuth2 Desktop)
 */

const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const readline = require('readline');

// ── CONFIG ─────────────────────────────────────────────────────────────────
const ROOT         = path.join(__dirname, '..');
const SECRETS_FILE = path.join(__dirname, 'client_secrets.json');
const TOKEN_FILE   = path.join(__dirname, '.yt_token.json');
const SCOPES       = ['https://www.googleapis.com/auth/youtube.upload',
                      'https://www.googleapis.com/auth/youtube'];

// ── MÉTADONNÉES VIDÉO — modifie ici avant chaque upload ──────────────────
const VIDEO_CONFIG = {
  videoFile:   path.join(ROOT, 'output', 'ancient-campfire_11h_FINAL.mp4'),
  thumbFile:   path.join(ROOT, 'assets', 'thumbnails', 'ancient-campfire-thumb.png'),

  title:       '(No Ads) 🔥 Ancient Campfire Sounds | Black Screen | 11 Hours Deep Sleep',
  description: `Let the ancient campfire carry you into the deepest sleep of your life. 🔥

Pure, crackling fire sounds recorded in the wild — no music, no interruptions, just the timeless comfort of flames burning through the night.

✅ 11 Hours — full night, no restart needed
✅ Zero ads — no jarring interruptions
✅ Black screen — saves battery, no light disturbance
✅ Perfect for: Deep Sleep · Study & Focus · Meditation · Relaxation · ASMR
✅ Works for: adults · light sleepers · stress relief · anxiety · tinnitus

🎧 Best at low volume — let the fire fill the room.

⏰ CHAPTERS
00:00:00 Fire begins — gentle crackling
00:30:00 Full campfire ambience
02:00:00 Deep night fire
05:00:00 Midnight embers
07:00:00 Fire settles — softer crackling
09:00:00 Final hour — steady warmth
10:30:00 Gentle fade into dawn

💬 Where would you want this campfire to be? Mountains, forest, or beach?
🔔 Subscribe for new sleep soundscapes every week. Free. No ads. Ever.

#CampfireSounds #FireSounds #SleepSounds #DeepSleep #RelaxingSounds #CampfireASMR #StudyMusic #MeditationMusic #NatureSounds #NoAds #11Hours #BlackScreen #SleepMusic #CracklingFire #AmbientSounds`,

  tags: [
    'campfire sounds','fire sounds for sleep','crackling fire','campfire sleep',
    'fire sounds 11 hours','deep sleep sounds','relaxing fire','campfire asmr',
    'sleep sounds','nature sounds','study music','meditation music','ambient sounds',
    'no ads sleep','black screen sleep','campfire night','fire crackling',
    'sleep music','relaxation sounds','stress relief sounds','campfire 11 hours'
  ],

  categoryId:  '10',      // Music
  language:    'en',
  privacyStatus: 'unlisted' // Toi tu vérifies puis passes en Public
};
// ──────────────────────────────────────────────────────────────────────────

async function getAuthClient() {
  if (!fs.existsSync(SECRETS_FILE)) {
    console.error('ERREUR: client_secrets.json introuvable dans scripts/');
    console.error('Suis le guide: guides/pre_publish.md → section OAuth2');
    process.exit(1);
  }

  const secrets = JSON.parse(fs.readFileSync(SECRETS_FILE));
  const { client_id, client_secret, redirect_uris } = secrets.installed || secrets.web;

  const oauth2 = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:8080');

  // Token déjà sauvé ?
  if (fs.existsSync(TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_FILE));
    oauth2.setCredentials(token);
    // Refresh si expiré
    if (token.expiry_date && token.expiry_date < Date.now()) {
      const { credentials } = await oauth2.refreshAccessToken();
      fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials));
      oauth2.setCredentials(credentials);
    }
    return oauth2;
  }

  // Première fois : flow OAuth2
  const authUrl = oauth2.generateAuthUrl({ access_type: 'offline', scope: SCOPES });
  console.log('\n=== AUTORISATION REQUISE ===');
  console.log('1. Ouvre ce lien dans ton navigateur:');
  console.log('\n' + authUrl + '\n');
  console.log('2. Connecte-toi avec ton compte Google (la chaîne)');
  console.log('3. Autorise l\'accès');
  console.log('4. Tu seras redirigé vers localhost:8080 — attends...\n');

  // Serveur local pour recevoir le callback OAuth
  const code = await new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const qs = new url.URL(req.url, 'http://localhost:8080').searchParams;
      const code = qs.get('code');
      res.end('<h1>Autorisation OK ! Retourne dans le terminal.</h1>');
      server.close();
      if (code) resolve(code); else reject(new Error('No code received'));
    }).listen(8080);
  });

  const { tokens } = await oauth2.getToken(code);
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens));
  oauth2.setCredentials(tokens);
  console.log('Token sauvé dans .yt_token.json\n');
  return oauth2;
}

async function uploadVideo(auth) {
  const yt = google.youtube({ version: 'v3', auth });
  const cfg = VIDEO_CONFIG;

  if (!fs.existsSync(cfg.videoFile)) {
    console.error('ERREUR: fichier vidéo introuvable:', cfg.videoFile);
    process.exit(1);
  }

  const fileSize  = fs.statSync(cfg.videoFile).size;
  const fileSizeGB = (fileSize / 1e9).toFixed(2);
  console.log(`\nUpload: ${path.basename(cfg.videoFile)} (${fileSizeGB} GB)`);
  console.log('Titre:', cfg.title);
  console.log('Durée estimée: 30-90 min selon ta connexion\n');

  let lastProgress = 0;
  const startTime  = Date.now();
  let res;

  // Retry loop — jusqu'à 5 tentatives sur ECONNRESET/ETIMEDOUT
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      res = await yt.videos.insert({
        part: ['snippet', 'status'],
        requestBody: {
          snippet: {
            title:       cfg.title,
            description: cfg.description,
            tags:        cfg.tags,
            categoryId:  cfg.categoryId,
            defaultLanguage:      cfg.language,
            defaultAudioLanguage: cfg.language,
          },
          status: {
            privacyStatus:           cfg.privacyStatus,
            selfDeclaredMadeForKids: false,
          }
        },
        media: { mimeType: 'video/mp4', body: fs.createReadStream(cfg.videoFile) }
      }, {
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.bytesRead / fileSize) * 100);
          if (pct !== lastProgress && pct % 5 === 0) {
            const elapsed = ((Date.now() - startTime) / 60000).toFixed(1);
            const speed   = (evt.bytesRead / 1e6 / ((Date.now() - startTime) / 1000)).toFixed(1);
            console.log(`  ${pct}% — ${elapsed} min — ${speed} MB/s`);
            lastProgress = pct;
          }
        }
      });
      break; // succès
    } catch (err) {
      const retryable = ['ECONNRESET','ETIMEDOUT','ENOTFOUND','EPIPE'].includes(err.code) || err.message.includes('write');
      if (retryable && attempt < 5) {
        const wait = attempt * 30;
        console.log(`  Tentative ${attempt}/5 échouée (${err.code||err.message}) — retry dans ${wait}s...`);
        await new Promise(r => setTimeout(r, wait * 1000));
      } else {
        throw err;
      }
    }
  }

  const videoId = res.data.id;
  console.log(`\nOK Upload terminé! Video ID: ${videoId}`);
  console.log(`Lien: https://youtu.be/${videoId}`);
  console.log(`Studio: https://studio.youtube.com/video/${videoId}/edit\n`);

  // Thumbnail
  if (fs.existsSync(cfg.thumbFile)) {
    console.log('Upload thumbnail...');
    await yt.thumbnails.set({
      videoId,
      media: { body: fs.createReadStream(cfg.thumbFile) }
    });
    console.log('OK Thumbnail uploadée');
  }

  // ⚠️  MONÉTISATION: pas possible via API YouTube Data v3
  // → Va dans Studio: https://studio.youtube.com/video/${videoId}/monetization
  console.log('\n⚠️  MONÉTISATION:');
  console.log(`   Active manuellement: https://studio.youtube.com/video/${videoId}/monetization`);
  console.log('   Active AVANT de rendre publique si vidéo encore en "private"\n');

  return videoId;
}

(async () => {
  try {
    console.log('=== SLEEP CHANNEL — UPLOAD YOUTUBE ===\n');
    const auth    = await getAuthClient();
    const videoId = await uploadVideo(auth);
    console.log('=== UPLOAD COMPLET ===');
    console.log(`Vidéo: https://youtu.be/${videoId}`);
  } catch (err) {
    console.error('ERREUR:', err.message);
    if (err.code === 403) console.error('→ Quota API dépassé ou OAuth2 insuffisant');
    if (err.code === 401) { fs.unlinkSync(TOKEN_FILE); console.error('→ Token invalide supprimé, relance le script'); }
    process.exit(1);
  }
})();
