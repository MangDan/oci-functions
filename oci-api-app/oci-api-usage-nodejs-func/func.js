const fdk = require('@fnproject/fdk');
var fs = require('fs');
var usage = require('./services/usage');
var alasql = require('alasql');
//var logger = require('./logger');
const configs = require('./configuration');
const configuration = configs.configs;

let tenantName = "apackrsct01"; //default
let auth = {};

fdk.handle(async function (payload) {

  // for health check (to avoid cold starting)
  if(payload === "" || payload === undefined || payload === null)
    return {"health": "good"};
  
  let result = "";

  tenantName = payload.tenantName;

  auth.tenancyId = configuration[tenantName].tenancyId;
  auth.userId = configuration[tenantName].userId;
  auth.keyFingerprint = configuration[tenantName].keyFingerprint;
  auth.RESTversion = configuration[tenantName].RESTversion;
  auth.region = configuration[tenantName].region;
  auth.privateKey = fs.readFileSync(configuration[tenantName].privateKeyFile, 'ascii');
  auth.passphrase = configuration[tenantName].passphrase;

  //var payload = "parameters": {"body": {"timeUsageStarted": "2020-11-01T00:00:00.00Z", "timeUsageEnded": "2020-11-30T00:00:00.00Z", "granularity": "MONTHLY", "queryType": "USAGE"}}}

  let parameters = { "body": {} };

  parameters.body.tenantId = configuration[tenantName].tenancyId;
  parameters.body.timeUsageStarted = payload.timeUsageStarted + "T00:00:00.00Z";
  parameters.body.timeUsageEnded = payload.timeUsageEnded + "T00:00:00.00Z";
  parameters.body.granularity = payload.granularity;
  parameters.body.queryType = payload.queryType;
  parameters.body.compartmentDepth = 6; // 6:ALL
  if (payload.groupBy !== null || payload.groupBy !== undefined)
    parameters.body.groupBy = payload.groupBy;
  if (payload.filter !== null || payload.filter !== undefined)
    parameters.body.filter = payload.filter;
  if (payload.top !== null || payload.top !== undefined)
    parameters.top = payload.top;
  else
    parameters.top = 1;
  if (payload.filter !== null || payload.filter !== undefined)
    parameters.filter = payload.filter;

  if (payload.resource.api == 'RequestSummarizedUsages')
    result = await requestSummarizedUsages(parameters);
  else if (payload.resource.api == 'TopCompartmentsBySummarizedUsage')
    result = await topCompartmentsBySummarizedUsage(parameters);
  else if (payload.resource.api == 'TopServicesBySummarizedUsage')
  result = await topServicesBySummarizedUsage(parameters);
  else {
    result = "Invalid API name, please use a valid API name.";
  }

  return result;
})

async function requestSummarizedUsages(parameters) {
  return new Promise((resolve, reject) => {
    try {
      let response = {};
      let computedAmount = 0;
      let currency;

      auth.RESTversion = '/20200107';
      usage.summary.post(auth, parameters, function (data) {

        data.items.forEach(function (item, idx) {
          if (item.currency.trim() !== "") {
            currency = item.currency;
            computedAmount += item.computedAmount;
          }
        });

        response.currency = currency;
        response.computedAmount = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: currency }).format(computedAmount);

        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function topCompartmentsBySummarizedUsage(parameters) {
  return new Promise((resolve, reject) => {
    try {
      auth.RESTversion = '/20200107';
      usage.summary.post(auth, parameters, function (data) {

        let response = alasql('SELECT TOP ' + parameters.top + ' * FROM (SELECT compartmentId, compartmentName, currency, SUM(computedAmount) AS computedAmount FROM ? WHERE TRIM(currency) <> "" GROUP BY compartmentId, compartmentName, currency) a ORDER BY a.computedAmount DESC',[data.items]);

        response.forEach(function(data, idx){
          data.computedAmount = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: data.currency }).format(data.computedAmount);

        });
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function topServicesBySummarizedUsage(parameters) {
  return new Promise((resolve, reject) => {
    try {
      auth.RESTversion = '/20200107';
      usage.summary.post(auth, parameters, function (data) {

        let response = alasql('SELECT TOP ' + parameters.top + ' * FROM (SELECT service, currency, SUM(computedAmount) AS computedAmount FROM ? WHERE TRIM(currency) <> "" GROUP BY service, currency) a ORDER BY a.computedAmount DESC',[data.items]);

        response.forEach(function(data, idx){
          data.computedAmount = new Intl.NumberFormat('ko-KR', { style: 'currency', currency: data.currency }).format(data.computedAmount);

        });
        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}