# sempv2-js

This is a Javascript SEMPv2 client for the Solace messaging management API. 
SEMPv2 is a Swagger API allows you to connect to any Solace message-router 
(version 7.2 or greater) and do standard CRUD operations on Solace entities 
including:

* Message-VPNs
* Queues
* Client Usernames
* Client Profiles
* ACL Profiles (partially, see TODO below)

It is a dynamic library that converts all data transfers back and forth between 
JSON and Javascript objects. It does not make use of any of Swagger code-generation.

## TODO

Since this is an initial version, it does not yet manage the following entity types:

* Bridges
* LDAP Authorization Groups
* REST Delivery Points

ACL-Profiles are more deeply-structured than most other entities including nested 
entities for each of connect, publish and subscribe rules. Only basic create/delete 
operations work at this time.

## Example Code

The swagger-client module makes use of javascript Promises to help manage 
the order in which commands are executed and the sempv2-js module leverages 
this approach, often exposing the resulting Promises as return values. 

Here are some common examples.

```javascript
var semp = require('sempv2-js');
var client  = new semp.SempClient('solace1:8080', 'adminuser', 'c00k1es');

const vpnname   = 'deleteme';
const queuename = 'example_queue';

console.log('Creating new msg-vpn ' + vpnname);
client.createMsgVpn(vpnname)
	.then( (vpn) => {
		if(vpn == null || !vpn.ok)
			console.log('Msg-VPN create failed!');
		console.log('Creating queue ' + queuename);
		return client.createQueue(vpnname, queuename);
	})
	.then( (queue) => {
		if(queue == null || !queue.ok)
			console.log('Queue create failed!');
		// continue creating other stuff ...
		// ...
		// Clean up everything you created
		return client.deleteVpnAndAllEntities(vpnname);
	})
	.then (result) => {
	    if (result == null || !result.ok) {
	        console.log('FAILED to delete ' + vpnname);
	    }
	})
	.catch( (err) => { console.log('ERR: ' + err); });
```

## Dependencies

This module depends on existing swagger-client module from npm. You can install 
it by running `npm install swagger-client` or `npm install -g swagger-client`.

## Tests

This module uses the Mocha test framework and Chai assertion library for a 
'literate' style of unit testing. Tests can be found in `test/test.js`.

> These tests __require__ a Solace message router, and are configured to 
> connect to the router via an IP-address and authenticating as a suitably-privileged 
> admin-user. _These all must be set in test/test.js for the test cases to work 
> properly_.

To setup for your testing, we assume you already have a Solace message router. 
If not see (the [Solace Developers Portal](http://dev.solace.com/get-started/start-up-solace-messaging/)). 
If you want to test this client against a router, modify the following variables 
at the top of test/test.js:

```javascript 
// -- test/test.js

////////////////////////////////////////
///  MODIFY THESE TO YOUR SOLACE ENV ///
////////////////////////////////////////
const TESTHOST = '192.168.56.151:8080';
const TESTUSER = 'testuser';
const TESTPASS = 'c00k13s';
////////////////////////////////////////
///  DO NOT MODIFY BELOW THIS LINE   ///
////////////////////////////////////////
```

