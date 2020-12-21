const fdk = require('@fnproject/fdk');
var fs = require('fs');
var rm = require('./services/rm');
//var logger = require('./logger');
const configs = require('./configuration');
const configuration = configs.configs;

let tenantName = "apackrsct01"; //default
let auth = {};

fdk.handle(async function (payload) {
  let result = "";

  auth.tenancyId = configuration[tenantName].tenancyId;
  auth.userId = configuration[tenantName].userId;
  auth.keyFingerprint = configuration[tenantName].keyFingerprint;
  auth.RESTversion = configuration[tenantName].RESTversion;
  auth.region = configuration[tenantName].region;
  auth.privateKey = fs.readFileSync(configuration[tenantName].privateKeyFile, 'ascii');
  auth.passphrase = configuration[tenantName].passphrase;

  if(payload.type === 'get')
    result = await get(payload.parameters);
  else if (payload.type === 'craete')
  result = await create(payload.parameters);

  return result;
})

async function get(parameters) {
  return new Promise((resolve, reject) => {
    try {
      auth.RESTversion = '/20180917';
      rm.job.get(auth, parameters, function (data) {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function create(parameters) {
  return new Promise((resolve, reject) => {
    try {
      auth.RESTversion = '/20180917';
      rm.job.create(auth, parameters, function (data) {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}