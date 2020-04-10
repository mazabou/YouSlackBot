const {env} = require('process');
const fs = require('fs');
const path = require('path');
const {RTMClient} = require('@slack/client');

const ytDigest = require('./localModules/ytDigest');
const {debug} = require('./localModules/debug');
const {createUserList} = require('./localModules/userList');
const {getName} = require('./localModules/getName');

const CREDS_DIR = '.credentials';
const HOME_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE);
const SLACK_CREDS_FILE = 'slackCREDS';
const {xoxb} = require(path.resolve(HOME_DIR, CREDS_DIR, SLACK_CREDS_FILE));
let options = {};
!!env.DEBUG ? options.logLevel = 'debug' : false;
let rtm = new RTMClient(xoxb, options);

// why save user list to disk tho, let's not
let userList;

/**
 * Connects to the slack channel and is also used to
 * start up other required modules.
 */
rtm.start().then(result => {
  debug.log('connected to', result.team.domain);

  createUserList(xoxb).then((data) => {
    if (data) {
      debug.log('got user list. # members: ', data.length);
    }

    userList = data;
    // console.log(userList && userList.members ? userList.members.length : 0)
    // console.log(global.userList && global.userList.members ? global.userList.members.length : 0)
  })

}).catch(error => {
  console.log('error calling slack web api', error);
}); // eof rtm.start

/**
 * Turns the message events on and passes it along to look
 * for various components within the message text body.
 *
 * rtm.on
 * Turns on message event watching.
 *
 ** handleRtmMessage Handles incoming message events from Slack
 ** @param {object} message  Contains incoming message object from Slack
 */
rtm.on('message', function handleRtmMessage(message) {

  if (message.type === 'message' && message.text !== '') {

    let nameId = getName(message.user, userList); // Sets nameId as the actual name of the message user not the ID

    if (message.text !== undefined && message.text.indexOf("youtu") >= 0) { // looks for youtube links and parses the ID with ytDigest module function in ./localModules/ - then logs message to console
      ytDigest(message); // sends whole message object to be parsed and uploaded to youtube playlist
    }

    debug.log('start.js:message:', nameId + ': ' + message.text); // Logs all messages to the console with user name and message text
  }

}); // eof rtm.on
