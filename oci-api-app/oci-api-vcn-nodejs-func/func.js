const fdk=require('../oci-api-usage-nodejs-func/node_modules/@fnproject/fdk');
var fs = require('fs');
var core = require('./services/core');
//var logger = require('./logger');
const configs = require('./configuration');
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

fdk.handle(async function(payload){

  // for health check (to avoid cold starting)
  if(payload === "" || payload === undefined || payload === null)
    return {"health": "good"};
    
  let result = "";

  //var payload = {"resource": {"action": "GetVcn"},"reqbody": {"vcnId": "ocid1.vcn.oc1.ap-seoul-1.amaaaaaavsea7yias7cup4eb2mvksf4gsz7yghre2vkhytqc44yppmkgbrda"}}
  if(payload.resource.api == 'GetVcn') {
     result = await getVCN(payload.reqbody);
  } else {
    result = "없어요";
  }

  return result;
})

async function getVCN(reqbody) {
  return new Promise((resolve, reject) => {
    
    try {
      auth.RESTversion = '/20160918';
      var parameters = {
        vncId: reqbody.vcnId
      };
  
      core.vcn.get(auth, parameters, function(data) {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}