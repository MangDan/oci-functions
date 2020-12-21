const fdk = require('@fnproject/fdk');
var fs = require('fs');
var product = require('./services/product');
var alasql = require('alasql');
//var logger = require('./logger');

let auth = {};

fdk.handle(async function (payload) {

  // for health check (to avoid cold starting)
  if(payload === "" || payload === undefined || payload === null)
    return {"health": "good"};
    
  let result = "";
  let parameters = {};

  // X-Oracle-Accept-CurrencyCode, partNumber, shortDisplayName
  if(payload.currency !== undefined && payload.currency !== null)
    parameters['x-oracle-accept-currencycode'] = payload.currency;
  parameters['parentProductPartNumber'] = "B88206";
  parameters['limit'] = "500";

  if(payload.partNumber !== undefined && payload.partNumber !== null)
    parameters['partNumber'] = payload.partNumber;

  if(payload.displayName !== undefined && payload.displayName !== null)
    parameters['displayName'] = "%" + payload.displayName + "%";
  else
    parameters['displayName'] = "%";
  
  if (payload.resource.api == 'SearchPriceList')
    result = await searchPriceList(parameters);
  else if (payload.resource.api == 'GetPriceDetail') {
    result = await getPriceDetail(parameters);
  } else {
    result = "없어요";
  }

  return result;
})

async function searchPriceList(parameters) {
  return new Promise((resolve, reject) => {
    try {
      product.price.get(auth, parameters, function (data) {

        // data에서 displayName을 활용하여 upper like 검색한 결과만 반환한다.
        //let response = alasql('SELECT displayName FROM ? WHERE LOWER(displayName) LIKE '+ parameters.displayName,[data.items]);
        // let response = alasql('SELECT partNumber, REPLACE(displayName, partNumber || " - ", "") AS displayName, shortDisplayName, serviceCategoryDisplayName FROM ? WHERE UPPER(serviceCategoryDisplayName) LIKE UPPER("%'+parameters.serviceCategoryDisplayName+'%")',[data.items]);

        let response = alasql('SELECT partNumber, REPLACE(displayName, partNumber || " - ", "") AS displayName FROM ? WHERE UPPER(displayName) LIKE UPPER("%'+parameters.displayName+'%")',[data.items]);

        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getPriceDetail(parameters) {
  return new Promise((resolve, reject) => {
    try {
      product.price.get(auth, parameters, function (data) {

        let response = alasql('SELECT shortDisplayName, description, prices FROM ? WHERE UPPER(partNumber) = UPPER("'+parameters.partNumber+'")',[data.items]);

        response[0].prices.forEach(function(price, idx){
          price.value = new Intl.NumberFormat('ko-KR', { style: 'currency', maximumSignificantDigits: 10, currency: parameters['x-oracle-accept-currencycode'] }).format(price.value);
        });

        resolve(response);
      });
    } catch (error) {
      reject(error);
    }
  });
}