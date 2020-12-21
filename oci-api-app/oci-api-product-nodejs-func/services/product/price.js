var ocirest = require('../../utils/ocirest.js');
var endpoint = require('../../configs/endpoints.js');

  function get( auth, parameters, callback ) {
    var possibleHeaders = ['x-oracle-accept-currencycode'];
    var possibleQueryStrings = ['parentProductPartNumber', 'partNumber', 'limit'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters );
    var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );

    console.log(JSON.stringify(headers));

    ocirest.process( auth,
                     { path : '/itas/.anon/myservices/api/v1/products' + queryString,
                       host : endpoint.service.myService['default'],
                       method : 'GET',
                       headers : headers},
                     callback );
  }
  
  module.exports = {
    get: get
  };