/*
 * Write your server code in this file.
 *
 * name: Lianghui Wang
 * email: wangl9@oregonstate.edu
 */


// Importing Node's built-in modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Server configuration
const PORT = process.env.PORT || 3000;

// Object to map file extensions to MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg'
};

// Function to read and serve files from the static directory
const serveStaticFile = (res, filePath, contentType) => {
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == 'ENOENT') {
        // File not found, serve 404
        fs.readFile('./static/404.html', (error, content) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        // Some server error
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + '..');
      }
    } else {
      // Success, serve file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

// Function to serve dynamic content for /posts/<n>
const serveDynamicPost = (res, postNumber) => {
  const dynamicContent = `
  <html>
    <body>
      <h1>You requested post #${postNumber}.</h1>
    </body>
  </html>
  `;
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(dynamicContent, 'utf-8');
};

// Creating the server
const server = http.createServer((req, res) => {
  let filePath = './static' + req.url;
  if (filePath == './static/') {
    filePath = './static/index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  if (req.url.startsWith('/posts/') && !isNaN(parseInt(req.url.split('/posts/')[1]))) {
    const postNumber = parseInt(req.url.split('/posts/')[1]);
    serveDynamicPost(res, postNumber);
  } else {
    fs.exists(filePath, (exist) => {
      if(exist) {
        serveStaticFile(res, filePath, contentType);
      } else {
        // If the file does not exist, serve a 404
        serveStaticFile(res, './static/404.html', 'text/html');
      }
    });
  }
});

server.listen(PORT, () => {
  console.log('Server is listening on port ' + PORT);
});
