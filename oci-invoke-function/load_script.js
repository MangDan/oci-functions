import http from 'k6/http';
import {
  Counter,
  Rate
} from 'k6/metrics';
import {
  check,
  sleep
} from "k6";

export let errorRate = new Rate("errors");

let myTrend = new Counter('total_req_elapsed_time');

export let options = {
  setupTimeout: '30s',
  duration: null
};

export default function () {
  var url = 'https://egzfd6qaqjdeaxmsi7c4nlaoc4.apigateway.ap-seoul-1.oci.customer-oci.com/mymusictastemw/java';

  let payload = JSON.stringify({
    channel: "server",
    email: "test@example.org",
    event: "Test Event Name",
    messageId: "test-message-myj23m",
    projectId: "hfT8nNSB5l",
    properties: {
      property1: 1,
      property2: "test",
      property3: true,
      propertyarray: [{
        key1: "value1",
        key2: "value2"
      }, {
        key1: "value1",
        key2: "value2"
      }, {
        key1: "value1",
        key2: "value2"
      }, {
        key1: "value1",
        key2: "value2"
      }, {
        key1: "value1",
        key2: "value2"
      }]
    }
  });

  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  let res = http.post(url, payload, params);

  check(res, {
    'status was 200': r => r.status == 200,
    'transaction time OK': r => r.timings.duration < 30000,
    'added response duration': r => myTrend.add(res.timings.duration / 1000)
  }) || errorRate.add(1);

  sleep(0.3);
}