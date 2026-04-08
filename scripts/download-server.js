const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const filePath = '/tmp/aristo-latest.tar.gz';
  
  if (!fs.existsSync(filePath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('File not found');
    return;
  }

  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename="aristo-latest.tar.gz"',
    'Transfer-Encoding': 'chunked'
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

server.listen(5002, '0.0.0.0', () => {
  console.log('Download server running on port 5002');
});
