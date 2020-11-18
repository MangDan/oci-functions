
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

async function createTopic(body) {
//    logger.log('info', `runShippingExtractionJob for ${JSON.stringify(input)} for file ${objectName}`)
    auth.RESTversion = '/20181201';
    parameters.method = 'POST';
    parameters.body = JSON.stringify({ body });
    notifications.topic.create(auth, parameters, callback);
    return;

    

}// getTopic

module.exports = {
    createTopic: createTopic
}

// test call
createTopic({name: "test_topic",compartmentId: "ocid1.compartment.oc1..aaaaaaaa6mftkwknfsag2erfobxfjjvsikc6osihtddczhlglzxnwxamrdlq",description: "Channel for admin messages"})
