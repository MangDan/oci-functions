var fs = require('fs');
var notifications = require('../../notifications.js');
//var logger = require('./logger');
const configs = require('../../../configuration');
const configuration = configs.configs;

var auth = {
    tenancyId: configuration.tenancyId,
    userId: configuration.userId,
    keyFingerprint: configuration.keyFingerprint,
    RESTversion: configuration.RESTversion,
    region: configuration.region
};
auth.privateKey = fs.readFileSync(configuration.privateKeyFile, 'ascii');
auth.passphrase = configuration.passphrase
// set up parameters object
//
var parameters = {
    compartmentId: configuration.compartmentId
};
var callback = function (data) {
//    logger.log('debug', JSON.stringify(data))
    console.log(JSON.stringify(data))
};

async function pushMessage(message) {
//    logger.log('info', `runShippingExtractionJob for ${JSON.stringify(input)} for file ${objectName}`)
    auth.RESTversion = '/20181201';
    parameters.method = 'POST';
    parameters.topicId = 'ocid1.onstopic.oc1.ap-seoul-1.aaaaaaaajapefqh6ujbz7v4d2hkpjal7lfwfad7mnpr6eznkvrumjrgtjswa';  // rokebi
    parameters.path = 'messages';
    parameters.body = message;
    notifications.topic.publish(auth, parameters, callback);
    return;

}// pushMessage

module.exports = {
    pushMessage: pushMessage
}

var message = {
    "message": {
      "notification": { 
         "title": "TitleTest",
         "body": "Sample message for Android endpoints"
      },
      "data": {
          "picture": "https://i.imgur.com/bY2bBGN.jpg",
          "link": "https://example.com"
      },
      "token": "dENbszoqxqI:APA91bGfazCIFLCqMBI9Tsb5f9oGkvkeykz70NULzI-OTaFBqhzwTPt2SPS2tDfm-V2O9lJsfYk5gKYppqJksFl5CqOtubeIwpJ4_zSwPzm15erTkfM6iQsIycrYfgtsWDNPzF3y-nbv"
    }
  };

// test call
pushMessage({ title: "Push notification test", body: JSON.stringify(message)})
