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
function get(host, gethdr, vpn, entity) {
// var get = function (host, gethdr, vpn, entity) {
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
function inferName(entity) {
// var inferName = function(entity) {
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
function deleteObjectsRec(objects, delhdr, i) {
// var deleteObjectsRec = function (objects, delhdr, i) {
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

function recursiveHttpRequest (url, hdr, op, exlist, i) {
	if (exlist == null || exlist.length == 0) {
		return Promise.resolve(null);
	}
	if (i >= exlist.length) {
		return Promise.resolve(null);
	}
	var req = {
		url    : url,
		method : op,
       		headers: hdr,
		body   : JSON.stringify(exlist[i])
	};
	return Swagger.http(req)
		.then( (res) => {
			return recursiveHttpRequest(url, hdr, op, exlist, i+1)
				.then( (next) => {
					if (next == null) return res;
					else return next;
				});
		});
};

function collect (objects, links, HDR) {
	if ( nullOrEmpty(links) ) return Promise.resolve(null);
	var req = {
		url    : links.splice(0,1)[0],
		method : 'GET',
       		headers: HDR
	};
	return Swagger.http(req)
		.then( (res) => {
			if ( !nullOrEmpty(res.body.data) ) {
				// do this to normalize scalar data|links objects and array data|links objects
				var items = [].concat( res.body.data );
				var sublinks= [].concat( res.body.links );
				for( var i = 0; i < sublinks.length; i++) {
					var item= items[i];
					var sls = sublinks[i];
					// sls.uri is special, it s the link to this item, 
					// so use it for mapping but don't recurse it
					var olink = sls.uri;
					delete sls.uri;
					// store this data item in our global map
					objects[olink] = item;
					// add values from sub-links map to the list 
					// of links we are recursing over
					links = links.concat( values(sls) );
				}
			}
			return collect(objects, links, HDR)
				.then( (next) => {
					if (next == null) return res;
					else return next;
				});
		});
}

function nullOrEmpty (obj) {
	if (obj == null) return true;
	else if (obj instanceof Array)
		return obj.length == 0;
	return Object.keys(obj).length == 0;
}

function values (d) {
	var keys = Object.keys(d);
	return keys.map(function(v) { return d[v]; });
}

function prettyprint (obj) {
	console.log(JSON.stringify(obj, null, 2));
	console.log('\n\n');
}

function stubify (url) {
	return url.match(/(.+)\/[^\/]+$/)[1];
}

function postAll( entries, hdr, methOver ) {
	if ( nullOrEmpty(entries) ) return Promise.resolve(null);
	var entry = entries.splice(0,1)[0];
	var url = stubify( entry.url );
	console.log('Processing URL: ' + entry.url);
	var meth = 'POST';
	if (methOver != null) {
		meth = methOver;
		url = entry.url;
	}
	console.log(meth + 'ing URL: ' + url);
	var req = {
		url    : url,
		method : meth,
       		headers: hdr,
		body: JSON.stringify(entry.entity)
	};
	return Swagger.http(req)
		.then( (res) => {
			return postAll( entries, hdr )
				.then( (next) => {
					if (next == null) return res;
					else return next;
				});
		})
		.catch( (err) => {
			console.log('ERR: ' + err);
			// Only retry once, otherwise can infinitely fail
			var retryMeth = null;
			if (methOver == null) {
				entries.unshift( entry );
				retryMeth = 'PUT';
			}
			return postAll( entries, hdr, retryMeth )
				.then( (next) => {
					if (next == null) return res;
					else return next;
				});
		});
}

module.exports = 
{
	get                  : get,
	deleteObjectsRec     : deleteObjectsRec,
	recursiveHttpRequest : recursiveHttpRequest,
	postAll              : postAll,
	stubify              : stubify,
	collect              : collect,
	inferName            : inferName,
	prettyprint          : prettyprint
};
