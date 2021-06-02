const fdk = require('@fnproject/fdk');
const https = require('https')
const axios = require('axios');
const CryptoJS = require('crypto-js')

fdk.handle(async function (payload) {

  //var postData = JSON.stringify(payload.data);

  var postData = JSON.stringify({"userId":"U01E21FEHU7","messagePayload":{"type":"application","payloadType":"problemMsg","channelName":"Slack","variables":{"tr_sender":"Kyudong","tr_compartmentName":payload.data.compartmentId,"tr_resourceName": payload.data.resourceName,"tr_eventTime":payload.eventTime,"tr_resourceId":payload.data.resourceId,"tr_riskLevel":payload.data.additionalDetails.riskLevel,"tr_problemDescription":payload.data.additionalDetails.problemDescription},"channelProperties":{"teamId":"T01EGP7U5J6","channel":"D01GFQ8JA1E"}}});

  var config = {
    method: 'post',
    url: 'https://oda-a8a3392d9e6046ef9348cc9def8c73cc-da8.data.digitalassistant.oci.oraclecloud.com/connectors/v2/listeners/application/channels/23fe1a32-b0b5-4bc3-80af-c1730af291be',
    headers: { 
      'Content-Type': 'application/json', 
      'X-Hub-Signature': 'sha256='+CryptoJS.HmacSHA256(postData, 'DdLTKP8NcHsMxGEHElJnxNH5EG3td9CE')
    },
    data : postData
  };
  
  await axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });




  // var options = {
  //   path: "/connectors/v2/listeners/application/channels/23fe1a32-b0b5-4bc3-80af-c1730af291be",
  //   hostname: "oda-a8a3392d9e6046ef9348cc9def8c73cc-da8.data.digitalassistant.oci.oraclecloud.com",
  //   host: "oda-a8a3392d9e6046ef9348cc9def8c73cc-da8.data.digitalassistant.oci.oraclecloud.com",
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json",
  //     'X-Hub-Signature': 'sha256=' + CryptoJS.HmacSHA256(postData, 'DdLTKP8NcHsMxGEHElJnxNH5EG3td9CE')
  //   },
  //   body: postData
  // }

  // // begin https request
  // var request = await https.request(options, res => {
  //   var chunks = [];

  //   res.on("data", function (chunk) {
  //     chunks.push(chunk);
  //   });

  //   res.on("end", function (chunk) {
  //     var body = Buffer.concat(chunks);
  //     console.log(body.toString());
  //   });

  //   res.on("error", function (error) {
  //     console.error(error);
  //   });
  // });

  // // send the body and close the request
  // request.write(postData === undefined ? '' : postData);
  // request.end();

  return "completed";
})