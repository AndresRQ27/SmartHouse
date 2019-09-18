//  include the http and url module
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

//  var for the user
const hostname = '0.0.0.0';
const port = 8080;

//  create the http server accepting requests to port 8080
http.createServer((req, res) => {
  const urlParsed = url.parse(req.url);
  const pathArray = urlParsed.pathname.split('/'); // First & last items empty

  //  direct the request to appropriate function
  switch (pathArray[1]) {
    case 'image':
      image(req, res);
      break;
    default:
      homepage(req, res);
  }
}).listen(port, hostname);

console.log(`Server running at http://${hostname}:${port}/`);

/**
 * Function that returns the homepage
 * Query example: http://127.0.0.1:8080/image/?image=msi.png
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
function image(req, res) {
  //  read the image using fs and send the image content back in the response
  fs.readFile(path.resolve(__dirname, `images/image.png`), function(err, content) {
    if (err) {
      res.writeHead(400, {'Content-type': 'text/html'});
      console.log(err);
      res.end('No such image');
    } else {
      //  specify the content type in the response will be an image
      res.writeHead(200, {'Content-type': 'image/jpg'});
      res.end(content);
    }
  });
}

/**
 * Function that returns the homepage
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
function homepage(req, res) {
  res.writeHead(400, {'Content-type': 'text/plain'});
  res.end('Hello, this is the home page :)');
}
