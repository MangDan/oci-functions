var ocirest = require('../../utils/ocirest.js');
var endpoint = require('../../configs/endpoints.js');

function publish( auth, parameters, callback ){
;    var possibleHeaders = ['opc-request-id'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters, false );
    ocirest.process( auth,
        { path : auth.RESTversion + "/topics" + (parameters.topicId != "" ? "/" + parameters.topicId : "") + (parameters.path != "" ? "/" + parameters.path : ""),
          host : endpoint.service.notifications[auth.region],
          headers : headers,
          body : parameters.body,
          method : parameters.method },
        callback ); 
}

function get( auth, parameters, callback ){
      var possibleHeaders = ['opc-request-id'];
      var headers = ocirest.buildHeaders( possibleHeaders, parameters, true );
      ocirest.process( auth,
          { path : auth.RESTversion + "/topics" + (parameters.topicId != "" ? "/" + parameters.topicId : ""),
            host : endpoint.service.notifications[auth.region],
            headers : headers,
            method : parameters.method },
          callback ); 
  }

function create( auth, parameters, callback ){
      var possibleHeaders = ['opc-retry-token', 'opc-request-id'];
      var headers = ocirest.buildHeaders( possibleHeaders, parameters, true );
      ocirest.process( auth,
          { path : auth.RESTversion + "/topics",
            host : endpoint.service.notifications[auth.region],
            headers : headers,
            method : parameters.method },
          callback ); 
  }

function update( auth, parameters, callback ){
    var possibleHeaders = ['if-match', 'opc-request-id'];
    var headers = ocirest.buildHeaders( possibleHeaders, parameters, false );
    ocirest.process( auth,
        { path : auth.RESTversion + "/topics" + (parameters.topicId != "" ? "/" + parameters.topicId : ""),
          host : endpoint.service.notifications[auth.region],
          headers : headers,
          method : parameters.method },
        callback ); 
}

function list( auth, parameters, callback ){
  var possibleHeaders = ['opc-request-id'];
  var possibleQueryStrings = ['compartmentId'];
  var headers = ocirest.buildHeaders( possibleHeaders, parameters, true );
  var queryString = ocirest.buildQueryString( possibleQueryStrings, parameters );

  ocirest.process( auth,
      { path : auth.RESTversion + "/topics" + queryString,
        host : endpoint.service.notifications[auth.region],
        headers : headers,
        method : parameters.method },
      callback ); 
}

module.exports = {
    publish: publish,
    get: get,
    create: create,
    update: update,
    list: list
};