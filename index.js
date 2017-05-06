var Swagger = require('swagger-client');
var Helper  = require('./Helper');

/**
 * Represents SempClient, ready to connect and issue SEMP queries
 * @constructor
 * @param {string} host - host or address in the form 'host:port'
 * @param {string} username - username to use for HTTP basic auth
 * @param {string} password - password to use for HTTP basic auth
 **/
function SempClient (host, username, password) {
	this._host = host;
	this._posthdr = { 
		'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64') ,
		'Content-Type': 'application/json'
	};
	this._gethdr = { 
		'Authorization': 'Basic ' + new Buffer(username+':'+password).toString('base64')
	};
}

/**
 * Returns the URI-base of the SempClient's configured server.
 *
 * @param {string} vpn - optional name of a msg-VPN base.
 * @returns {string} url-base string e.g. 'http://<host>:<port>/SEMP/v2/config/msgVpns'
 **/
SempClient.prototype.urlBase = function(vpn) {
	if (vpn == null) { 
		return 'http://'+this._host+'/SEMP/v2/config/msgVpns';
	}
	return 'http://'+this._host+'/SEMP/v2/config/msgVpns/'+vpn;
}

/**
 * INDIVIDUAL ENTITY GETTERS
 **/
/**
 * Retrieves Msg-VPN entity by name.
 *
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} with a Msg-VPN entity {Object}
 **/
SempClient.prototype.getMsgVpn = function(vpn) {
	return Helper.get(this._host, this._gethdr, vpn, null);
}
/**
 * Retrieves ACL-Profile entity by name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} aclProfile - ACL-Profile name
 * @returns Swagger-client http response {Promise} with an ACL-Profile entity {Object}
 **/
SempClient.prototype.getAclProfile = function(vpn, aclProfile) {
	return Helper.get(this._host, this._gethdr, vpn, 'aclProfiles/'+aclProfile);
}
/**
 * Retrieves Client-Profile entity by name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} clientProfile - Client-Profile name
 * @returns Swagger-client http response {Promise} with a Client-Profile entity {Object}
 **/
SempClient.prototype.getClientProfile = function(vpn, clientProfile) {
	return Helper.get(this._host, this._gethdr, vpn, 'clientProfiles/'+clientProfile);
}
/**
 * Retrieves Client-Username entity by name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} clientUsername - Client-Username name
 * @returns Swagger-client http response {Promise} with a Client-Username entity {Object}
 **/
SempClient.prototype.getClientUsername = function(vpn, clientUsername) {
	return Helper.get(this._host, this._gethdr, vpn, 'clientUsernames/'+clientUsername);
}
/**
 * Retrieves Queue entity by name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} queue - queue name
 * @returns Swagger-client http response {Promise} with a Queue entity {Object}
 **/
SempClient.prototype.getQueue = function(vpn, queue) {
	return Helper.get(this._host, this._gethdr, vpn, 'queues/'+queue);
}
/**
 * Retrieves TopicEndpoint entity by name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} topicEndpoint - TopicEndpoint name
 * @returns Swagger-client http response {Promise} with a TopicEndpoint entity {Object}
 **/
SempClient.prototype.getTopicEndpoint = function(vpn, topicEndpoint) {
	return Helper.get(this._host, this._gethdr, vpn, 'topicEndpoints/'+topicEndpoint);
}
/**
 * Retrieves the list of ACL-Profile client-connection exceptions ACL-Profile name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} aclname - ACL-Profile name
 * @returns Swagger-client http response {Promise} with a client-connection exception list entity {Object}
 **/
SempClient.prototype.getAclProfileConnectionExceptionsList = function(vpn, aclname) {
	return Helper.get(this._host, this._gethdr, vpn, 'aclProfiles/'+aclname+'/clientConnectExceptions');
}
/**
 * Retrieves the list of ACL-Profile subscribe exceptions ACL-Profile name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} aclname - ACL-Profile name
 * @returns Swagger-client http response {Promise} with a subscribe exception list entity {Object}
 **/
SempClient.prototype.getAclProfileSubscribeExceptionsList = function(vpn, aclname) {
	return Helper.get(this._host, this._gethdr, vpn, 'aclProfiles/'+aclname+'/subscribeExceptions');
}
/**
 * Retrieves the list of ACL-Profile publish exceptions ACL-Profile name per Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} aclname - ACL-Profile name
 * @returns Swagger-client http response {Promise} with a publish exception list entity {Object}
 **/
SempClient.prototype.getAclProfilePublishExceptionsList = function(vpn, aclname) {
	return Helper.get(this._host, this._gethdr, vpn, 'aclProfiles/'+aclname+'/publishExceptions');
}


/** 
 * BULK ENTITY GETTERS
 **/
/**
 * Retrieves all Msg-VPN entities for this instance. 
 * @returns Swagger-client http response {Promise} with a result-set {Object} list of Msg-VPN configs and links list of URL's per each entity.
 **/
SempClient.prototype.getMsgVpns = function() {
	return Helper.get(this._host, this._gethdr, null, null);
}
/**
 * Retrieves all ACL-Profile entities in a single Msg-VPN. 
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} with a result-set {Object} list of ACL-Profile configs and links list of URL's per each entity.
 **/
SempClient.prototype.getAclProfiles = function(vpn) {
	return Helper.get(this._host, this._gethdr, vpn, 'aclProfiles');
}
/**
 * Retrieves all Client-Profile entities in a single Msg-VPN. 
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} with a result-set {Object} list of Client-Profile configs and links list of URL's per each entity.
 **/
SempClient.prototype.getClientProfiles = function(vpn) {
	return Helper.get(this._host, this._gethdr, vpn, 'clientProfiles');
}
/**
 * Retrieves all Client-Username entities in a single Msg-VPN. 
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} with a result-set {Object} list of Client-Username configs and links list of URL's per each entity.
 **/
SempClient.prototype.getClientUsernames = function(vpn) {
	return Helper.get(this._host, this._gethdr, vpn, 'clientUsernames');
}
/**
 * Retrieves all Queue entities in a single Msg-VPN. 
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} with a result-set {Object} list of Queue configs and links list of URL's per each entity.
 **/
SempClient.prototype.getQueues = function(vpn) {
	return Helper.get(this._host, this._gethdr, vpn, 'queues');
}
/**
 * Retrieves all TopicEndpoint entities in a single Msg-VPN. 
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} with a result-set {Object} list of TopicEndpoint configs and links list of URL's per each entity.
 **/
SempClient.prototype.getTopicEndpoints = function(vpn) {
	return Helper.get(this._host, this._gethdr, vpn, 'topicEndpoints');
}

/**
 * CREATION METHODS: 
 * Creates an empty SEMP entity for updating.
 **/
SempClient.prototype.createObject = function (url, obj) {
	var request = {
		url    : url,
		method : 'POST',
		body   : JSON.stringify(obj),
       		headers: this._posthdr
	};
	return Swagger.http(request);
}
/**
 * Creates a new Msg-VPN entity with all default values.
 * @param {string} vpn - Msg-VPN name
 * @returns {Object} swagger result set including status and the full created object.
 **/
SempClient.prototype.createMsgVpn = function (name) {
	return this.createObject(
			this.urlBase(),
			{ msgVpnName: name });
}
/**
 * Creates a new ACL-Profile entity with all default values in a named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} name - ACL-Profile name
 * @returns {Object} swagger result set including status and the full created object.
 **/
SempClient.prototype.createAclProfile = function (vpn, name) {
	return this.createObject(
			this.urlBase(vpn) + '/aclProfiles', 
			{ aclProfileName: name });
}
/**
 * Creates a new Client-Profile entity with all default values in a named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} name - Client-Profile name
 * @returns {Object} swagger result set including status and the full created object.
 **/
SempClient.prototype.createClientProfile = function (vpn, name) {
	return this.createObject(
			this.urlBase(vpn) + '/clientProfiles', 
			{ clientProfileName: name });
}
/**
 * Creates a new Client-Username entity with all default values in a named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} name - Client-Username name
 * @returns {Object} swagger result set including status and the full created object.
 **/
SempClient.prototype.createClientUsername = function (vpn, name) {
	return this.createObject(
			this.urlBase(vpn) + '/clientUsernames', 
			{ clientUsername: name });
}
/**
 * Creates a new Queue entity with all default values in a named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} name - Queue name
 * @returns {Object} swagger result set including status and the full created object.
 **/
SempClient.prototype.createQueue = function (vpn, name) {
	return this.createObject(
			this.urlBase(vpn) + '/queues', 
			{ queueName: name });
}
/**
 * Creates a new TopicEndpoint entity with all default values in a named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} name - TopicEndpoint name
 * @returns {Object} swagger result set including status and the full created object.
 **/
SempClient.prototype.createTopicEndpoint = function (vpn, name) {
	return this.createObject(
			this.urlBase(vpn) + '/topicEndpoints', 
			{ topicEndpointName: name });
}


/**
 * MODIFICATION METHODS:
 * Updates an existing SEMP entity at a URL.
 **/
SempClient.prototype.updateObject = function (url, obj) {
	var request = {
		url    : url,
		method : 'PUT',
		body   : JSON.stringify(obj),
       		headers: this._posthdr
	};
	return Swagger.http(request);
}
/**
 * Update an existing Msg-VPN entity with contents of a local Msg-VPN object.
 * @param {string} vpnname - Msg-VPN name
 * @param {Object} vpn - Msg-VPN update object
 * @returns Swagger-client http response {Promise} result of the HTTP PUT operation.
 **/
SempClient.prototype.updateMsgVpn = function (vpnname, vpn) {
	return this.updateObject(this.urlBase(vpnname), vpn);
}
/**
 * Update an existing ACL-Profile entity with contents of a local ACL-Profile object.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} profile - ACL-Profile update object
 * @returns Swagger-client http response {Promise} result of the HTTP PUT operation.
 **/
SempClient.prototype.updateAclProfile = function (vpn, profile) {
	return this.updateObject(
		this.urlBase(vpn)+'/aclProfiles/'+profile.aclProfileName, 
		profile);
}
/**
 * Update an existing Client-Profile entity with contents of a local Client-Profile object.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} profile - Client-Profile update object
 * @returns Swagger-client http response {Promise} result of the HTTP PUT operation.
 **/
SempClient.prototype.updateClientProfile = function (vpn, profile) {
	return this.updateObject(
		this.urlBase(vpn)+'/clientProfiles/'+profile.clientProfileName, 
		profile);
}
/**
 * Update an existing Client-Username entity with contents of a local Client-Username object.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} user - Client-Username update object
 * @returns Swagger-client http response {Promise} result of the HTTP PUT operation.
 **/
SempClient.prototype.updateClientUsername = function (vpn, user) {
	return this.updateObject(
		this.urlBase(vpn)+'/clientUsernames/'+user.clientUsername, 
		user);
}
/**
 * Update an existing Queue entity with contents of a local Queue object.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} queue - Queue update object
 * @returns Swagger-client http response {Promise} result of the HTTP PUT operation.
 **/
SempClient.prototype.updateQueue = function (vpn, queue) {
	return this.updateObject(
		this.urlBase(vpn)+'/queues/'+queue.queueName, 
		queue);
}
/**
 * Update an existing TopicEndpoint entity with contents of a local TopicEndpoint object.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} topicEndpoint - TopicEndpoint update object
 * @returns Swagger-client http response {Promise} result of the HTTP PUT operation.
 **/
SempClient.prototype.updateTopicEndpoint = function (vpn, topicEndpoint) {
	return this.updateObject(
		this.urlBase(vpn)+'/topicEndpoints/'+topicEndpoint.topicEndpointName, 
		topicEndpoint);
}
/**
 * Update an existing ACL-Profile client-connection exception list with new items.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} exlist - the list of exceptions to add
 * @returns Swagger-client http response {Promise} result of the HTTP operation.
 **/
SempClient.prototype.updateAclProfileConnectionExceptionsList = function (vpn, exlist) {
	var url = this.urlBase(vpn)+'/aclProfiles/'+exlist[0].aclProfileName+'/clientConnectExceptions';
	return Helper.recursiveHttpRequest( url, this._posthdr, 'POST', exlist, 0 );
}
/**
 * Update an existing ACL-Profile subscribe exception list with new items.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} exlist - the list of exceptions to add
 * @returns Swagger-client http response {Promise} result of the HTTP operation.
 **/
SempClient.prototype.updateAclProfileSubscribeExceptionsList = function (vpn, exlist) {
	var url = this.urlBase(vpn)+'/aclProfiles/'+exlist[0].aclProfileName+'/subscribeExceptions';
	return Helper.recursiveHttpRequest( url, this._posthdr, 'POST', exlist, 0 );
}
/**
 * Update an existing ACL-Profile publish exception list with new items.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} exlist - the list of exceptions to add
 * @returns Swagger-client http response {Promise} result of the HTTP operation.
 **/
SempClient.prototype.updateAclProfilePublishExceptionsList = function (vpn, exlist) {
	var url = this.urlBase(vpn)+'/aclProfiles/'+exlist[0].aclProfileName+'/publishExceptions';
	return Helper.recursiveHttpRequest( url, this._posthdr, 'POST', exlist, 0 );
}


/**
 * WARNING: DESTRUCTIVE!! This is a recursive message-VPN delete method. 
 * Deletes a message-VPN after deleting all clients, profiles, queues configured in it.
 *
 * @param {string} vpn - message-VPN name as a string.
 * @returns swagger-client Promise resulting from the last HTTP delete request.
 **/
SempClient.prototype.deleteMsgVpnAndAllEntities = function (vpn) {
	return this.deleteAllQueues(vpn)
		.then( (x) => {
			return this.deleteAllTopicEndpoints(vpn)
		}).then( (x) => {
			return this.deleteAllClientUsernames(vpn)
		}).then( (x) => {
			return this.deleteAllClientProfiles(vpn)
		}).then( (x) => {
			return this.deleteAllAclProfiles(vpn)
		}).then( (x) => {
			const request = {
				url    : this.urlBase(vpn),
				method : 'DELETE',
       				headers: this._gethdr
			};
			return Swagger.http(request);
		});
}


/**
 * SINGLE ENTITY DELETE METHODS
 * Deletes named entities by entity-type from a named message-VPN.
 **/
SempClient.prototype.deleteObject = function (vpn, objtype, objname) {
	var request = {
		url    : this.urlBase(vpn)+'/'+objtype+'/'+objname,
		method : 'DELETE',
       		headers: this._gethdr
	};
	return Swagger.http(request);
}
/**
 * Delete an existing ACL-Profile entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} aclProfile - ACL-Profile name to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteAclProfile = function (vpn, aclProfile) {
	return this.deleteObject(vpn, 'aclProfiles', aclProfile);
}
/**
 * Delete an existing client-connect exception in an ACL-Profile entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} exc - exception Object to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteAclProfileClientConnectException = function (vpn, exc) {
	return this.deleteObject(vpn, 'aclProfiles', 
		exc.aclProfileName+'/clientConnectExceptions/'+encodeURIComponent(exc.clientConnectExceptionAddress));
}
/**
 * Delete an existing publish exception in an ACL-Profile entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} exc - exception Object to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteAclProfilePublishException = function (vpn, exc) {
	return this.deleteObject(vpn, 'aclProfiles', 
		exc.aclProfileName+'/publishExceptions/'+exc.topicSyntax+','+encodeURIComponent(exc.publishExceptionTopic));
}
/**
 * Delete an existing subscribe exception in an ACL-Profile entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {Object} exc - exception Object to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteAclProfileSubscribeException = function (vpn, exc) {
	return this.deleteObject(vpn, 'aclProfiles', 
		exc.aclProfileName+'/subscribeExceptions/'+exc.topicSyntax+','+encodeURIComponent(exc.subscribeExceptionTopic));
}

/**
 * Delete an existing Client-Profile entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} clientProfile - Client-Profile name to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteClientProfile = function (vpn, clientProfile) {
	return this.deleteObject(vpn, 'clientProfiles', clientProfile);
}
/**
 * Delete an existing Client-Username entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} clientUsername - Client-Username name to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteClientUsername = function (vpn, clientUsername) {
	return this.deleteObject(vpn, 'clientUsernames', clientUsername);
}
/**
 * Delete an existing Queue entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} queue - Queue name to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteQueue = function (vpn, queue) {
	return this.deleteObject(vpn, 'queues', queue);
}
/**
 * Delete an existing TopicEndpoint entity from the server's named Msg-VPN.
 * @param {string} vpn - Msg-VPN name
 * @param {string} topicEndpoint - TopicEndpoint name to be deleted
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operation.
 **/
SempClient.prototype.deleteTopicEndpoint = function (vpn, topicEndpoint) {
	return this.deleteObject(vpn, 'topicEndpoints', topicEndpoint);
}


/*
 * BULK ENTITY DELETE METHODS
 * Deletes all entities by entity-type from a named message-VPN.
 */
/**
 * Delete all existing ACL-Profile entities from the server's named Msg-VPN. WARNING: DESTRUCTIVE; USE WITH CAUTION.
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operations.
 **/
SempClient.prototype.deleteAllAclProfiles = function (vpn) {
	return this.getAclProfiles(vpn)
		.then( (objects) => {
       			return Helper.deleteObjectsRec(objects, this._gethdr, 0);
		});
}
/**
 * Delete all existing Client-Profile entities from the server's named Msg-VPN. WARNING: DESTRUCTIVE; USE WITH CAUTION.
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operations.
 **/
SempClient.prototype.deleteAllClientProfiles = function (vpn) {
	return this.getClientProfiles(vpn)
		.then( (objects) => {
       			return Helper.deleteObjectsRec(objects, this._gethdr, 0);
		});
}
/**
 * Delete all existing Client-Username entities from the server's named Msg-VPN. WARNING: DESTRUCTIVE; USE WITH CAUTION.
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operations.
 **/
SempClient.prototype.deleteAllClientUsernames = function (vpn) {
	return this.getClientUsernames(vpn)
		.then( (objects) => {
       			return Helper.deleteObjectsRec(objects, this._gethdr, 0);
		});
}
/**
 * Delete all existing Queue entities from the server's named Msg-VPN. WARNING: DESTRUCTIVE; USE WITH CAUTION.
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operations.
 **/
SempClient.prototype.deleteAllQueues = function (vpn) {
	return this.getQueues(vpn)
		.then( (objects) => {
       			return Helper.deleteObjectsRec(objects, this._gethdr, 0);
		});
}
/**
 * Delete all existing TopicEndpoint entities from the server's named Msg-VPN. WARNING: DESTRUCTIVE; USE WITH CAUTION.
 * @param {string} vpn - Msg-VPN name
 * @returns Swagger-client http response {Promise} result of the HTTP DELETE operations.
 **/
SempClient.prototype.deleteAllTopicEndpoints = function (vpn) {
	return this.getTopicEndpoints(vpn)
		.then( (objects) => {
       			return Helper.deleteObjectsRec(objects, this._gethdr, 0);
		});
}


/*******************************************************************
 * EXPORTS
 *******************************************************************/
module.exports = 
{
	SempClient: SempClient
};
