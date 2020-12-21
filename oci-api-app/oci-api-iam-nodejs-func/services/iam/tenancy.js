var ocirest = require('../../utils/ocirest.js');
var endpoint = require('../../configs/endpoints.js');

  function get( auth, parameters, callback ) {
    var possibleHeaders = ['opc-request-id'];
    //var possibleQueryStrings = ['tenancyId'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters );
    //var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );

    ocirest.process( auth,
                     { path : auth.RESTversion + '/tenancies/' + parameters['tenancyId'],
                       host : endpoint.service.iam[auth.region],
                       method : 'GET',
                       headers : headers},
                     callback );
  }

  module.exports = {
    get: get
  };