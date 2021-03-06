//  include the http and url module
const url = require('url');
const path = require('path');
const exec = require('child_process').exec;
const express = require('express');
const app = express();

//  var for the user
const hostname = '0.0.0.0';
const port = 8080;
const pathController = 'house_controller';

let ledDining = false;
let ledKitchen = false;
let ledLiving = false;
let ledBed1 = false;
let ledBed2 = false;
let doorStatus = [false, false, false, false];

const admin = 'admin';
const adminPassword = 'admin';

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  param(req, res);
});

app.get('/image', (req, res) => {
  imageFile(req, res);
});

//  create the http server accepting requests to port 8080
app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

/**
 * Function that returns the param
 * It can also toggle the param values by using:
 * http://0.0.0.0:8080/image
 * http://0.0.0.0:8080/?led=kitchen
 * http://0.0.0.0:8080/?update
 * http://0.0.0.0:8080/?user=admin&&password=admin
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
function param(req, res) {
  //  use the url to parse the requested url and get the param number
  const query = url.parse(req.url, true).query;
  const ledRoom = query.led;
  const update = query.update;
  const user = query.user;
  const password = query.password;

  if (typeof ledRoom !== 'undefined') { //  Led is in the parameters
    console.log('Led parameter detected');
    detectRoom(req, res, ledRoom);
  } else if (typeof update !== 'undefined') {
    updateData(req, res);
  } else if (typeof user !== 'undefined' &&
    typeof password !== 'undefined') {
    authentication(req, res, user, password);
  } else {
    console.log('Invalid param');
    res.sendStatus(400);
  }
}

/**
 * Function that returns the param
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
async function imageFile(req, res) {
  //  read the image using fs and send the image content back in the response
  exec('fswebcam -r 640x480 /home/root/ServerApp/images/image.png',
      (error, stdout, stderr) => {});
  await sleep(2500);
  res.sendFile(path.resolve(__dirname, `images/image.png`));
}

/**
 * Function that authenticates
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 * @param {*} user: user for the auth
 * @param {*} password: password for the auth
 */
function authentication(req, res, user, password) {
  if (user === admin && password === adminPassword) {
    console.log('Authenticated');
    res.json({
      'auth': true,
    });
  } else {
    console.log('Not authenticated');
    res.json({
      'auth': false,
    });
  }
}

/**
 * Function that sends a JSON with last values
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 */
function updateData(req, res) {
  const doorStatus = updateDoors(req, res);

  res.json({
    'bed1': ledBed1,
    'bed2': ledBed2,
    'kitchen': ledKitchen,
    'living': ledLiving,
    'dining': ledDining,
    'door1': doorStatus[0],
    'door2': doorStatus[1],
    'door3': doorStatus[2],
    'door4': doorStatus[3],
  });
}

/**
 * Function that gets the values of the doors
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 * @return {Array} doorStatus
 */
function updateDoors(req, res) {
  //  First door
  let dir = exec(`${pathController} -d 0`,
      (error, stdout, stderr) => {}
  );
  dir.on('exit', (code) => {
    if (code === 1) {
      doorStatus[0] = true;
    } else if (code === 0) {
      doorStatus[0] = false;
    }
  });

  //  Second door
  dir = exec(`${pathController} -d 1`,
      (error, stdout, stderr) => {}
  );
  dir.on('exit', (code) => {
    if (code === 1) {
      doorStatus[1] = true;
    } else if (code === 0) {
      doorStatus[1] = false;
    }
  });

  //  Third door
  dir = exec(`${pathController} -d 2`,
      (error, stdout, stderr) => {}
  );
  dir.on('exit', (code) => {
    if (code === 1) {
      doorStatus[2] = true;
    } else if (code === 0) {
      doorStatus[2] = false;
    }
  });

  //  Fourth door
  dir = exec(`${pathController} -d 3`,
      (error, stdout, stderr) => {}
  );
  dir.on('exit', (code) => {
    if (code === 1) {
      doorStatus[3] = true;
    } else if (code === 0) {
      doorStatus[3] = false;
    }
  });

  return doorStatus;
}

/**
 * Function that detects the room in the request
 * @param {*} req: request parameter
 * @param {*} res: response parameter
 * @param {*} room: name of the room to toggle the param
 */
function detectRoom(req, res, room) {
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

  switchLed(req, res, roomNumber, roomBool);
}

/**
 * Function that toggles the param of a room
 * @param {*} req:
 * @param {*} res:
 * @param {*} roomNumber:
 * @param {*} roomBool:
 */
function switchLed(req, res, roomNumber, roomBool) {
  if (roomNumber === -1) { // Check if invalid room
    console.log('Invalid room');
    res.sendStatus(400);
  } else { // Executes the script
    console.log('Room number: ', roomNumber, roomBool);

    exec(`${pathController} -l ${roomNumber} ${roomBool}`,
        (error, stdout, stderr) => {
          console.log(error);
          console.log(stdout);
          console.log(stderr);
        }
    );

    res.sendStatus(200);
  }
}

/**
 * Function that sleeps for ms time
 * @param {*} ms: time to sleep
 * @return {*} promise of the timeout
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
