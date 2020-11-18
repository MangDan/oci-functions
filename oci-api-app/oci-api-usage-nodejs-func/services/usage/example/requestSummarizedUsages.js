
var fs = require('fs');
var core = require('../../core.js');
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

async function runShippingExtractionJob(vncId) {
//    logger.log('info', `runShippingExtractionJob for ${JSON.stringify(input)} for file ${objectName}`)
    auth.RESTversion = '/20160918';
    //
    // Upload file to objectStore
    //

    // set up the parameter object
    parameters = {
        vncId: vncId
    };

    core.vcn.get(auth, parameters, callback);
    return;

}// runShippingExtractionJob

module.exports = {
    runShippingExtractionJob: runShippingExtractionJob
}

// test call
runShippingExtractionJob("ocid1.vcn.oc1.ap-seoul-1.amaaaaaaonjthiiaeohx45b6mwadnwijsavzxmm7ncinwkj3mmlc2iasgnta");
