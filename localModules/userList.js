const {WebClient} = require('@slack/client');
const {debug} = require('./debug');

// slack WebClient reference
let web;

/**
 * createUserList()
 * Writes a complete list of current user objects to a JSON located at USER_ID_PATH
 *
 ** web.users.list(function()) Calls the SlackAPI function
 ** @param slackToken
 */
module.exports.createUserList = async (slackToken) => {

  if (typeof web === 'undefined') {
    debug.log('creating new slack web client');
    web = new WebClient(slackToken);
  }

  return await new Promise((resolve, reject) => {
    web.users.list().then(result => {
      debug.log('got response from slack web client');

      if (result.ok) {
        resolve(result.members);
      } else {
        debug.log('slack user list response not ok');
        reject(result.error);
      }

    }).catch(error => {
      console.log('error getting user list', error);
      reject(error);
    });

  });

};