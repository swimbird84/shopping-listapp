const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE = path.join('D:', 'VibeCoding', 'Study-06');

http.createServer((req, res) => {
  const file = req.url === '/' ? 'index.html' : req.url.slice(1);
  fs.readFile(path.join(BASE, file), (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}).listen(8765, '127.0.0.1', () => {
  console.log('Server running at http://127.0.0.1:8765/');
});
