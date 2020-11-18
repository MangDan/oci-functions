const fdk=require('@fnproject/fdk');
var fs = require('fs');
var usage = require('./services/usage');
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

// var parameters = {
//   compartmentId: configuration.compartmentId
// };

fdk.handle(async function(payload){
  let result = "";

  //var payload = {"resource": {"api": "RequestSummarizedUsages"}, "tenantId": "ocid1.tenancy.oc1..aaaaaaaa6ma7kq3bsif76uzqidv22cajs3fpesgpqmmsgxihlbcemkklrsqa","timeUsageStarted": "2020-11-10T00:00:00", "timeUsageEnded": "2020-11-20T00:00:00", "granularity": "TOTAL", "dimensions": [{"value": "Gambas", "key": "compartmentName"}], "compartmentDepth": 1, "page":1, "limit":20}
  if(payload.resource.api == 'RequestSummarizedUsages') {
     result = await requestSummarizedUsages(payload.parameters);
  } else {
    result = "없어요";
  }

  return result;
})

async function requestSummarizedUsages(parameters) {
  return new Promise((resolve, reject) => {
    try {
      auth.RESTversion = '/20200107';

      // var sample = {
      //   resource: {
      //     api: "RequestSummarizedUsages"
      //   },
      //   parameters: {
      //     page: 1,
      //     limit: 20,
      //     body: {
      //       tenantId: "ocid1.tenancy.oc1..aaaaaaaa6ma7kq3bsif76uzqidv22cajs3fpesgpqmmsgxihlbcemkklrsqa",
      //       timeUsageStarted: "2020-11-01T00:00:00.00Z",
      //       timeUsageEnded: "2020-11-16T00:00:00.00Z",
      //       granularity: "MONTHLY",
      //       queryType: "USAGE",
      //       groupBy: [
      //         "service"
      //       ],
      //       filter: {
      //         dimensions: [{
      //           key: "compartmentName",
      //           value: "Gambas"
      //         }]
      //       }
      //     }
      //   }
      // };
      
      usage.summary.post(auth, parameters, function(data) {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}