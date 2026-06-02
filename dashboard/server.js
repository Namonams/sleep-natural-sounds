const http = require('http');
const fs   = require('fs');
const path = require('path');
const dir  = __dirname;

const mime = { '.html':'text/html', '.json':'application/json', '.css':'text/css', '.js':'text/javascript', '.png':'image/png' };

http.createServer((req, res) => {
  const filePath = path.join(dir, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0]));
  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}).listen(3000, () => console.log('Dashboard: http://localhost:3000'));
