const fdk=require('@fnproject/fdk');
const admin=require('firebase-admin');
const serviceAccount = require('./path/to/fcn-test-d468e-firebase-adminsdk-91ox1-e86d9984ce.json');

var app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://fcn-test-d468e.firebaseio.com'
});

const fcm = admin.messaging();

fdk.handle(async function(input){
  console.log(input.message.notification);

//var fcm_target_token = 'dENbszoqxqI:APA91bGfazCIFLCqMBI9Tsb5f9oGkvkeykz70NULzI-OTaFBqhzwTPt2SPS2tDfm-V2O9lJsfYk5gKYppqJksFl5CqOtubeIwpJ4_zSwPzm15erTkfM6iQsIycrYfgtsWDNPzF3y-nbv'

const payload = {
  notification: input.message.notification,
  data: input.message.data,
  token: input.message.token
};

//const payload_test = {
//  notification: {
//    title: 'TitleTest',
//    body: 'Sample message for Android endpoints'
//  },
//  data: {
//    picture: 'https://i.imgur.com/bY2bBGN.jpg',
//    link: 'https://example.com'
//  },
//  token: 'dENbszoqxqI:APA91bGfazCIFLCqMBI9Tsb5f9oGkvkeykz70NULzI-OTaFBqhzwTPt2SPS2tDfm-V2O9lJsfYk5gKYppqJksFl5CqOtubeIwpJ4_zSwPzm15erTkfM6iQsIycrYfgtsWDNPzF3y-nbv'
//};

const response = await fcm.send(payload);
return "successfully sent message:" + response;
//return input;

//  fcm.sendToDevice(fcm_target_token, payload)......
})
