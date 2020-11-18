
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

async function updateTopic(body) {
//    logger.log('info', `runShippingExtractionJob for ${JSON.stringify(input)} for file ${objectName}`)
    auth.RESTversion = '/20181201';
    parameters.method = 'PUT';
    parameters.topicId = 'ocid1.onstopic.oc1.ap-seoul-1.aaaaaaaajapefqh6ujbz7v4d2hkpjal7lfwfad7mnpr6eznkvrumjrgtjswa';
    parameters.body = JSON.stringify({ body });
    notifications.topic.update(auth, parameters, callback);
    return;

    

}// getTopic

module.exports = {
    updateTopic: updateTopic
}

// test call
updateTopic({description: "Updated..."})
