var ocirest = require('../../utils/ocirest.js');
var endpoint = require('../../configs/endpoints.js');

  function post( auth, parameters, callback ) {
    var possibleHeaders = ['opc-request-id'];
    var possibleQueryStrings = ['page', 'limit'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters );
    var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );

    ocirest.process( auth,
                     { path : auth.RESTversion + '/usage' + queryString,
                       host : endpoint.service.usage[auth.region],
                       method : 'POST',
                       headers : headers,
                       body : parameters.body },
                     callback );
  }
  
  module.exports = {
    post: post
  };