var Swagger = require('swagger-client');

/*******************************************************************
 * INTERNAL API --
 *******************************************************************/

/**
 * General http GET over javascript objects
 *
 * @param {host} host name or address in form 'host:port'
 * @param {gethdr} all HTTP headers for the GET request; if AUTH is needed you must add them to this object.
 * @param {vpn} message-VPN name as a string.
 * @param {entity} entity string, e.g. 'clientUsernames', 'aclProfiles', 'clientProfiles', etc.
 * @return Promise resulting from Swagger.http() call.
 **/
// function get(host, gethdr, vpn, entity) {
var get = function (host, gethdr, vpn, entity) {
	var url = 'http://'+host+'/SEMP/v2/config/msgVpns';
	if (vpn != null ) {
		url += '/'+vpn;
	}
	if (entity != null) {
		url += '/'+entity;
	}
	var request = {
		url    : url,
       		headers: gethdr
	};
	return Swagger.http(request)
		.then( (res) => { return res.body; });
};

/** Different entities have different fieldnames for their 'name' identifier; 
 * this function tries to pull the name out of any possible entity w/o
 * caring which type of entity that is.
 * 
 * @param {entity} object to infer name from; different object types have differently-named name fields.
 * @return the name of the object as a string.
 **/
// function inferName(entity) {
var inferName = function(entity) {
	if (entity == null) {
		console.log('Cannot find any name on NULL entity!');
		return '';
	}
	var names = 
		[ 'clientUsername', 'aclProfileName' , 'queueName', 'topicEndpointName', 'clientProfileName', 'msgVpnName', 'authorizationGroupName', 'bridgeName', 'restDeliveryPointName', 'remoteMsgVpnName', 'queueBindingName', ];
	for(var i = 0; i < names.length; i++) {
		if ( names[i] in entity ) {
			return entity[ names[i] ];
		}
	}
	console.log('WARNING! Could not find name field for entity ' + JSON.stringify(entity));
	return '';
};

/**
 * Recursively descends an object deleting all associated entities.
 * @param {objects} list of objects in a format returned from a Swagger GET query.
 * @param {delhdr} list of HTTP headers for the DELETE operation; if AUTH is needed those headers should be part of this object.
 * @param {i} integer index of the item in the objects map to be deleted. Will be incremented on each call.
 * @return a resolved Promise after the last delete completes.
 **/
// function deleteObjectsRec(objects, delhdr, i) {
var deleteObjectsRec = function (objects, delhdr, i) {
	if (objects == null || objects.data == null) {
		return Promise.resolve(null);
	}
	var num = objects.data.length;
	if (i >= num) {
		return Promise.resolve(null);
	}
	var name = inferName(objects.data[i]);
	if (name[0] == '#' || name == 'default') {
		// console.log('Skipping object ' + i + ' ' + name);
		return deleteObjectsRec(objects, delhdr, i+1);
	}
	var request = {
		url    : objects.links[i].uri,
		method : 'DELETE',
       		headers: delhdr
	};
	return Swagger.http(request)
		.then( (res) => {
			return deleteObjectsRec(objects, delhdr, i+1)
				.then( (nestedres) => {
					if (nestedres == null) return res;
					else return nestedres;
				});
		});
};

module.exports = 
{
	get: get,
	deleteObjectsRec: deleteObjectsRec,
	inferName: inferName
};
