var ocirest = require('../../utils/ocirest.js');
var endpoint = require('../../configs/endpoints.js');

  function get( auth, parameters, callback ) {
    var possibleHeaders = ['opc-request-id'];
    //var possibleQueryStrings = ['page', 'limit'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters );
    //var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );

    ocirest.process( auth,
                     { path : auth.RESTversion + '/jobs/' + parameters["jobId"],
                       host : endpoint.service.rm[auth.region],
                       method : 'GET',
                       headers : headers},
                     callback );
  }

  function create( auth, parameters, callback ) {
    var possibleHeaders = ['opc-request-id'];
    //var possibleQueryStrings = ['page', 'limit'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters );
    //var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );

    ocirest.process( auth,
                     { path : auth.RESTversion + '/jobs',
                       host : endpoint.service.rm[auth.region],
                       method : 'POST',
                       headers : headers,
                       body : parameters.body},
                     callback );
  }
  
  module.exports = {
    get: get,
    create: create
  };