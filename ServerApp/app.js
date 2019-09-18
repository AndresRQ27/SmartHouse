//  include the http and url module
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

//  var for the user
const hostname = '0.0.0.0';
const port = 8080;

let ledDining = false;
let ledKitchen = false;
let ledLiving = false;
let ledBed1 = false;
let ledBed2 = false;

//  create the http server accepting requests to port 8080
http.createServer((req, res) => {
  const urlParsed = url.parse(req.url);
  const pathArray = urlParsed.pathname.split('/'); // First & last items empty

  //  direct the request to appropriate function
  if (pathArray[1] === 'image') { //  If ascking for image, process
    image(req, res);
  } else { // Else, show homepage
    homepage(req, res);
  }
}).listen(port, hostname);

console.log(`Server running at http://${hostname}:${port}/`);

/**
 * Function that returns the homepage
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
function homepage(req, res) {
  //  use the url to parse the requested url and get the led number
  const query = url.parse(req.url, true).query;
  const ledRoom = query.led;

  if (typeof ledRoom !== 'undefined') { //  Led is in the parameters
    console.log('Led parameter detected');
    switchLed(ledRoom);
  }

  res.writeHead(400, {'Content-type': 'text/plain'});
  res.end('Hello, this is the home page :)');
}

/**
 * Function that returns the homepage
 * Query example: http://0.0.0.0:8080/image/
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
async function image(req, res) {
  //  read the image using fs and send the image content back in the response
  exec('fswebcam -r 640x480 images/image.png', (error, stdout, stderr) => {});
  fs.readFile(path.resolve(__dirname, `images/image.png`), (err, content) => {
    if (err) {
      res.writeHead(400, {'Content-type': 'text/html'});
      console.log(err);
      res.end('No such image');
    } else {
      //  specify the content type in the response will be an image
      res.writeHead(200, {'Content-type': 'image/png'});
      res.end(content);
    }
  });
}

/**
 * Function that toggles the led of a room
 * It can also toggle the led values by using:
 * http://0.0.0.0:8080/?led=kitchen
 * @param {*} room: name of the room to toggle the led
 */
function switchLed(room) {
  let roomBool;
  let roomNumber;

  switch (room) {
    case 'kitchen': //  Sets kitchen
      ledKitchen = !ledKitchen;
      roomBool = ledKitchen;
      roomNumber = 0;
      break;
    case 'living': // Sets living
      ledLiving = !ledLiving;
      roomBool = ledLiving;
      roomNumber = 1;
      break;
    case 'dining': // Sets dining
      ledDining = !ledDining;
      roomBool = ledDining;
      roomNumber = 2;
      break;
    case 'bed1': //  Sets bed1
      ledBed1 = !ledBed1;
      roomBool = ledBed1;
      roomNumber = 3;
      break;
    case 'bed2': // Sets bed2
      ledBed2 = !ledBed2;
      roomBool = ledBed2;
      roomNumber = 4;
      break;
    default: // Sets invalid room
      roomBool = false;
      roomNumber = -1;
      break;
  }

  if (roomNumber === -1) { // Check if invalid room
    console.log('Invalid room');
  } else { // Executes the script
    exec(`../GPIO/house_controller -l ${roomNumber} ${roomBool}`,
        (error, stdout, stderr) => {});
  }
}
