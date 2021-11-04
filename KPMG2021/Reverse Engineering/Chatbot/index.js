// Line Chatbot to check the input information
// @199knjaj

'use strict';

const line = require('@line/bot-sdk');
const express = require('express');
const config = require('./config.json');
const nodemailer = require("nodemailer");
var db_config = JSON.parse(fs.readFileSync("./config.json"));

// create LINE SDK client
const client = new line.Client(config);

const app = express();

var mysql = require('mysql');

var pool = mysql.createPool({
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.databse,
  connectionLimit: 2000
});

// webhook callback
app.post('/webhook', line.middleware(config), (req, res) => {
  // req.body.events should be an array of events
  if (!Array.isArray(req.body.events)) {
    return res.status(500).end();
  }
  // handle events separately
  Promise.all(req.body.events.map(event => {
    console.log('event', event);
    // check verify webhook event
    if (event.replyToken === '00000000000000000000000000000000' ||
      event.replyToken === 'ffffffffffffffffffffffffffffffff') {
      return;
    }
    return handleEvent(event);
  }))
    .then(() => res.end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// simple reply function
const replyText = (token, texts) => {
  texts = Array.isArray(texts) ? texts : [texts];
  return client.replyMessage(
    token,
    texts.map((text) => ({ type: 'text', text }))
  );
};

// callback function to handle a single event
function handleEvent(event) {
  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          return handleText(message, event);
        case 'image':
          return handleImage(message, event.replyToken);
        case 'video':
          return handleVideo(message, event.replyToken);
        case 'audio':
          return handleAudio(message, event.replyToken);
        case 'location':
          return handleLocation(message, event.replyToken);
        case 'sticker':
          return handleSticker(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }

    case 'follow':
      // replyText(event.replyToken, 'Got followed event');
      return handleFollow(event);
    case 'unfollow':
      // return console.log(`Unfollowed this bot: ${JSON.stringify(event)}`);
      return 0;
    case 'join':
      // return replyText(event.replyToken, `Joined ${event.source.type}`);
      return 0;
    case 'leave':
      // return console.log(`Left: ${JSON.stringify(event)}`);
      return 0;
    case 'postback':
      let data = event.postback.data;
      // return replyText(event.replyToken, `Got postback: ${data}`);
      return 0;
    case 'beacon':
      // const dm = `${Buffer.from(event.beacon.dm || '', 'hex').toString('utf8')}`;
      // return replyText(event.replyToken, `${event.beacon.type} beacon hwid : ${event.beacon.hwid} with device message = ${dm}`);
      return 0;

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
}

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isEmployeeCode(code) {
  if (typeof code != "string") return false;
  if (code.length != 5) return false;
  return !isNaN(code) && !isNaN(parseFloat(code));
}

function handleText(message, event) {
  var response = 'Sorry, the input value is invalid. Please try again.';
  var input;
  try {
    input = message.text.trim().split(' ');
    if (input.length === 2 && isEmployeeCode(input[0]) && validateEmail(input[1]) && input[1].substring(input[1].lastIndexOf("@") + 1) === 'CyberChallenge') {
      pool.getConnection(function (err, con) {
        if (err) {
          throw err;
        } else {
          con.query('INSERT INTO user2 (employeeCode,email,lineUid,timestamp) VALUES (?,?,?,?)', [input[0], input[1], event.source.userId, event.timestamp.toString()], function (err, result) {
            if (err) {
              console.log(err);
              throw err;
            } else {
              con.query('SELECT * FROM mainInfo (employeeCode, email, lineUid, timestamp) VALUE (?, ?, ?, ?)', [input[0], input[1], event.source.userId, event.timestamp.toString(), function(err, result)]);
              if(err){
                console.log(err);
                throw err;
              }
              else {
                response = 'The enquiry information is ';
                response += result.toString();
              }
              return replyText(event.replyToken, response);
            }
          });
        }
        con.release();
      });
    }else{
      return replyText(event.replyToken, response);
    }
  } catch (err) {
    return replyText(event.replyToken, response);
    throw err;
  }
}

function handleFollow(event) {
  pool.getConnection(function (err, con) {
    if (err) {
      console.log(err);
      throw err;
    } else {
      con.query('INSERT IGNORE INTO follow (lineUid,timestamp) VALUES (?,?)', [event.source.userId, event.timestamp.toString()], function (err, result) {
        if (err) {
          console.log(err);
          throw err;
        } 
      });
    }
    con.release();
  });
}

function handleImage(message, replyToken) {
  return replyText(replyToken, 'Sorry, the input value is invalid. Please try again.');
}

function handleVideo(message, replyToken) {
  return replyText(replyToken, 'Sorry, the input value is invalid. Please try again.');
}

function handleAudio(message, replyToken) {
  return replyText(replyToken, 'Sorry, the input value is invalid. Please try again.');
}

function handleLocation(message, replyToken) {
  return replyText(replyToken, 'Sorry, the input value is invalid. Please try again.');
}

function handleSticker(message, replyToken) {
  return replyText(replyToken, 'Sorry, the input value is invalid. Please try again.');
}

const port = config.port;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});

