/**
 * generate_monthly_report.js
 * Run on 1st of each month via GitHub Actions.
 * Reads yt_stats.json + previous reports → writes reports/monthly_YYYY-MM.json
 */
const fs   = require('fs');
const path = require('path');

const ROOT        = path.join(__dirname, '..');
const STATS_FILE  = path.join(ROOT, 'dashboard', 'yt_stats.json');
const REPORTS_DIR = path.join(ROOT, 'reports');

if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

const now   = new Date();
// Report covers the PREVIOUS month (run on 1st = close last month)
const reportDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const monthKey   = `${reportDate.getFullYear()}-${String(reportDate.getMonth() + 1).padStart(2, '0')}`;

const stats = JSON.parse(fs.readFileSync(STATS_FILE));

// Load all previous monthly reports for cumulative view
const prevReports = fs.readdirSync(REPORTS_DIR)
  .filter(f => f.match(/^monthly_\d{4}-\d{2}\.json$/))
  .sort()
  .map(f => JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, f))));

// Previous month snapshot (last report before this one)
const prev = prevReports.length > 0 ? prevReports[prevReports.length - 1] : null;

const subsNow   = stats.channel.subscribers;
const viewsNow  = stats.channel.totalViews;
const hoursNow  = stats.channel.watchTimeHours;
const subsPrev  = prev ? prev.channel.subscribers.end   : 0;
const viewsPrev = prev ? prev.channel.views.cumulative  : 0;
const hoursPrev = prev ? prev.channel.watchTime.cumulative : 0;

const report = {
  month:       monthKey,
  generatedAt: now.toISOString(),
  channel: {
    subscribers: {
      end:    subsNow,
      gained: subsNow - subsPrev
    },
    views: {
      thisMonth:  viewsNow - viewsPrev,
      cumulative: viewsNow
    },
    watchTime: {
      thisMonth:  hoursNow - hoursPrev,
      cumulative: hoursNow,
      targetHours: 4000,
      progressPct: Math.round((hoursNow / 4000) * 100 * 10) / 10
    }
  },
  yppProgress: {
    subscribers: {
      current: subsNow, target: 1000,
      pct: Math.round((subsNow / 1000) * 100 * 10) / 10
    },
    watchTime: {
      current: hoursNow, target: 4000,
      pct: Math.round((hoursNow / 4000) * 100 * 10) / 10
    },
    eta: null
  },
  videos: stats.videos.map(v => ({
    id: v.id, title: v.title, views: v.views,
    likes: v.likes, comments: v.comments, publishedAt: v.publishedAt
  })),
  history: prevReports.map(r => ({
    month: r.month,
    subscribers: r.channel.subscribers.end,
    viewsCumulative: r.channel.views.cumulative,
    watchHoursCumulative: r.channel.watchTime.cumulative
  }))
};

// ETA estimate based on velocity
if (prevReports.length >= 1) {
  const subsPerMonth  = report.channel.subscribers.gained;
  const hoursPerMonth = report.channel.watchTime.thisMonth;
  if (subsPerMonth > 0) {
    const monthsToSubGoal = Math.ceil((1000 - subsNow) / subsPerMonth);
    const monthsToHourGoal = hoursPerMonth > 0 ? Math.ceil((4000 - hoursNow) / hoursPerMonth) : null;
    report.yppProgress.eta = {
      monthsToSubs: monthsToSubGoal,
      monthsToHours: monthsToHourGoal,
      bottleneck: monthsToSubGoal > (monthsToHourGoal || 0) ? 'subscribers' : 'watchTime'
    };
  }
}

const outFile = path.join(REPORTS_DIR, `monthly_${monthKey}.json`);
fs.writeFileSync(outFile, JSON.stringify(report, null, 2));
console.log(`Report written: reports/monthly_${monthKey}.json`);

// Print summary for GitHub Actions log + issue body
const summary = `## 📊 Rapport Mensuel — ${monthKey}

**Abonnés**: ${subsNow} (+${report.channel.subscribers.gained} ce mois) / 1000 cible (${report.yppProgress.subscribers.pct}%)
**Vues ce mois**: ${report.channel.views.thisMonth} | Total: ${viewsNow}
**Watch time ce mois**: ${report.channel.watchTime.thisMonth}h | Total: ${hoursNow}h / 4000h (${report.yppProgress.watchTime.pct}%)

**Vidéos publiées**: ${stats.videos.length}
${stats.videos.map(v => `- [${v.title}](https://youtu.be/${v.id}) — ${v.views} vues`).join('\n')}

${report.yppProgress.eta ? `**ETA Monétisation (YPP)**: ~${Math.max(report.yppProgress.eta.monthsToSubs || 99, report.yppProgress.eta.monthsToHours || 99)} mois (bloquant: ${report.yppProgress.eta.bottleneck})` : ''}

---
*Généré automatiquement — Sleep Natural Sounds — ${new Date().toLocaleDateString('fr-FR')}*`;

console.log('\n--- ISSUE BODY ---');
console.log(summary);
console.log('--- END ---');

// Write summary to file for GitHub Actions to read
fs.writeFileSync(path.join(REPORTS_DIR, 'latest_summary.md'), summary);
