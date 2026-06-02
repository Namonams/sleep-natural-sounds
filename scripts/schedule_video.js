const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const SECRETS_FILE = path.join(__dirname, 'client_secrets.json');
const TOKEN_FILE   = path.join(__dirname, '.yt_token.json');

const VIDEO_ID    = '10KZSY5Y-MM';
const PUBLISH_AT  = '2026-06-02T07:00:00+02:00'; // 7h AM Paris (CEST)

async function scheduleVideo() {
  const secrets = JSON.parse(fs.readFileSync(SECRETS_FILE));
  const { client_id, client_secret } = secrets.installed || secrets.web;
  const oauth2 = new google.auth.OAuth2(client_id, client_secret, 'http://localhost:8080');
  const token  = JSON.parse(fs.readFileSync(TOKEN_FILE));
  oauth2.setCredentials(token);

  const yt = google.youtube({ version: 'v3', auth: oauth2 });

  const res = await yt.videos.update({
    part: ['status'],
    requestBody: {
      id: VIDEO_ID,
      status: {
        privacyStatus: 'private',
        publishAt: PUBLISH_AT,
        selfDeclaredMadeForKids: false
      }
    }
  });

  console.log('Video programmee pour:', PUBLISH_AT);
  console.log('Status:', res.data.status.privacyStatus);
  console.log('PublishAt:', res.data.status.publishAt);
  console.log('Studio: https://studio.youtube.com/video/' + VIDEO_ID + '/edit');
}

scheduleVideo().catch(err => {
  console.error('ERREUR:', err.message);
  if (err.errors) console.error(JSON.stringify(err.errors, null, 2));
});
