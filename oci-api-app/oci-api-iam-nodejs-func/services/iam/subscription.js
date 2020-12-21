var ocirest = require('../../utils/ocirest.js');
var endpoint = require('../../configs/endpoints.js');

  function get( auth, parameters, callback ) {
    var possibleHeaders = ['x-id-tenant-name'];
    //var possibleQueryStrings = ['tenancyId'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters );
    //var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );
    
    ocirest.process( auth,
                     { path : '/metering/api/v1/cloudbucks/' + parameters['accountId'],
                       host : endpoint.service.metering,
                       method : 'GET',
                       auth: auth.cloudAccountAdmin + ":" + auth.cloudAccountAdminPw,
                       headers : headers},
                     callback );
  }
  
  module.exports = {
    get: get
  };