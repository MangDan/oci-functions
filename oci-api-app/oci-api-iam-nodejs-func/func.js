const fdk=require('@fnproject/fdk');
var fs = require('fs');
var iam = require('./services/iam');
//var logger = require('./logger');
const configs = require('./configuration');
const configuration = configs.configs;

let tenantName = "apackrsct01";
let auth = {};

fdk.handle(async function(payload){

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

  if(payload.resource.api == 'GetTenancy') {
     payload.parameters.tenancyId = configuration[tenantName].tenancyId;
     result = await getTenancy(payload.parameters);
  } else if(payload.resource.api == 'GetSubscription') {
    result = await getSubscription(payload.parameters);
  } else {
    result = "none";
  }

  return result;
})

async function getTenancy(parameters) {
  return new Promise((resolve, reject) => {
    try {
      auth.RESTversion = '/20160918';

      iam.tenancy.get(auth, parameters, function(data) {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function getSubscription(parameters) {
  auth.cloudAccountAdmin = configuration[tenantName].cloudAccountAdmin;
  auth.cloudAccountAdminPw = configuration[tenantName].cloudAccountAdminPw;
  
  return new Promise((resolve, reject) => {
    try {
      iam.subscription.get(auth, parameters, function(data) {

        let date = new Date();
        let formattedDate = date.getFullYear() + "-" + ("0" + (1 + date.getMonth())).slice(-2) + "-" + ("0" + date.getDate()).slice(-2);

        let result = [];
        data.items.forEach(function(item, idx1){
          let payg = "N";
          let promotion = 'N';

          if(item.subscriptionCategory == 'CLOUD_CREDIT' && item.status == 'ACTIVE') {
            payg = item.payg;
            promotion = item.promotion;

            result.push({entitlementId: item.entitlementId, purchase : []});

            item.purchase.forEach(function(purchase, idx2) {
              let isCurrentPurchase = false;
              let commitmentModel = "";
              let commitmentModelKo = "";
              
                purchase.purchasedResources.forEach(function(purchasedResource, idx3) {
                  // 현재 기간이 포함된 purchase인지 여부
                  if(formattedDate >= purchasedResource.startDate.substring(0,10) && formattedDate <= purchasedResource.endDate.substring(0,10))
                    isCurrentPurchase = true
    
                  if(isCurrentPurchase) {
                    if(idx3 == 0)
                      result[idx1].purchase.push({id: purchase.id, purchasedResources: []});
    
                    // 경과일수 계산
                    let elapsedDays = Math.ceil((new Date() - new Date(purchasedResource.startDate)) / (1000 * 3600 * 24)) + " / " + Math.ceil((new Date(purchasedResource.endDate) - new Date(purchasedResource.startDate)) / (1000 * 3600 * 24));
    
                    // CommitmentModel
                    if(purchasedResource.commitmentModel) {
                      if(purchasedResource.commitmentModel == 'Annual') {
                        commitmentModel = 'Annual Flex';
                        commitmentModelKo = '선택적 연간 약정'
                      } else {
                        commitmentModel = purchasedResource.commitmentModel;
                        commitmentModelKo = purchasedResource.commitmentModel;
                      }
                    } else {
                      if(payg == 'Y' && promotion == 'Y') {
                        commitmentModel = 'Pay As You Go';
                        commitmentModelKo = "종량제 과금 (PAYG)"
                      }
                    }
    
                    //Math.round(purchasedResource.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    result[idx1].purchase[idx2].purchasedResources.push({commitmentModel: commitmentModel, commitmentModelKo: commitmentModelKo, value: new Intl.NumberFormat('ko-KR', { style: 'currency', currency: purchasedResource.unit }).format(purchasedResource.value), unit: purchasedResource.unit, startDate: purchasedResource.startDate.substring(0,10), endDate: purchasedResource.endDate.substring(0,10), isCurrentPurchase: isCurrentPurchase, elapsedDays: elapsedDays});
                  }
                });
            });
          } else if(item.subscriptionCategory == 'SRVC_ENTITLEMENT' && item.status == 'ACTIVE') { // SE Trial
            console.log("SE Trial");
          }
        });

        resolve(result);
      });
    } catch (error) {
      reject(error);
    }
  });
}