'use strict';
var expect = require('chai').expect;
var semp = require('../index');
var fs = require('fs')

////////////////////////////////////////
///  MODIFY THESE TO YOUR SOLACE ENV ///
////////////////////////////////////////
const TESTHOST = '192.168.56.151:8080';
const TESTUSER = 'testuser';
const TESTPASS = 'c00k13s';
////////////////////////////////////////
///  DO NOT MODIFY BELOW THIS LINE   ///
////////////////////////////////////////

const vpnname  = ranstring(30);
const queuename= 'deleteme_q';
const topicEndpointName='deleteme_dte';
const aclname  = 'deleteme_acl';
const cpname   = 'deleteme_cp';
const username = 'deleteme_user';

function ranstring(len)
{
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var text = '';
	for( var i=0; i < len; i++ ) {
		text += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return text;
}

function prettyprint(obj) {
	console.log(JSON.stringify(obj, null, 2));
}

describe('#SempClient.createMsgVpn', function() {
	it('should create a valid msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.createMsgVpn (vpnname)
			.then( (vpn) => {
				expect(vpn.body.data.msgVpnName).to.equal(vpnname);
				expect(vpn.ok).to.equal(true);
			});
	});
});
describe('#SempClient.getMsgVpn', function() {
	it('should retrieve a valid msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getMsgVpn (vpnname)
			.then( (vpn) => {
				expect(vpn.data.msgVpnName).to.equal(vpnname);
				expect(vpn.meta.responseCode).to.equal(200);
			});
	});
});
describe('#SempClient.updateMsgVpn', function() {
	it('should successfully modify a valid Msg-VPN via HTTP PUT of a valid record', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getMsgVpn (vpnname)
			.then( (vpn) => {
				expect(vpn.data.msgVpnName).to.equal(vpnname);
				expect(vpn.meta.responseCode).to.equal(200);
				vpn.data.maxMsgSpoolUsage = 123;
				return sc.updateMsgVpn(vpnname, vpn.data);
			})
			.then( (vpn) => {
				expect(vpn.ok).to.equal(true);
			})
			//.catch( (err) => { prettyprint(err); })
			;
	});
});

describe('#SempClient.createQueue', function() {
	it('should create a valid queue in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.createQueue (vpnname, queuename)
			.then( (queue) => {
				expect(queue.body.data.queueName).to.equal(queuename);
				expect(queue.ok).to.equal(true);
			});
	});
});
describe('#SempClient.getQueue', function() {
	it('should retreive a valid queue in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getQueue (vpnname, queuename)
			.then( (queue) => {
				expect(queue.data.queueName).to.equal(queuename);
				expect(queue.meta.responseCode).to.equal(200);
			});
	});
});
describe('#SempClient.updateQueue', function() {
	it('should successfully modify a valid Queue in a msgvpn via HTTP PUT of a valid record', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getQueue (vpnname, queuename)
			.then( (queue) => {
				expect(queue.data.queueName).to.equal(queuename);
				expect(queue.meta.responseCode).to.equal(200);
				//console.log('Modifying existing Queue ' + queuename);
				queue.data.maxMsgSpoolUsage = 0;
				return sc.updateQueue(vpnname, queue.data);
			})
			.then( (queue) => {
				expect(queue.ok).to.equal(true);
			});
	});
});

describe('#SempClient.createTopicEndpoint', function() {
	it('should create a valid topicEndpoint in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.createTopicEndpoint (vpnname, topicEndpointName)
			.then( (topicEndpoint) => {
				expect(topicEndpoint.body.data.topicEndpointName).to.equal(topicEndpointName);
				expect(topicEndpoint.ok).to.equal(true);
			});
	});
});
describe('#SempClient.getTopicEndpoint', function() {
	it('should retreive a valid topicEndpoint in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getTopicEndpoint (vpnname, topicEndpointName)
			.then( (topicEndpoint) => {
				expect(topicEndpoint.data.topicEndpointName).to.equal(topicEndpointName);
				expect(topicEndpoint.meta.responseCode).to.equal(200);
			});
	});
});
describe('#SempClient.updateTopicEndpoint', function() {
	it('should successfully modify a valid TopicEndpoint in a msgvpn via HTTP PUT of a valid record', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getTopicEndpoint (vpnname, topicEndpointName)
			.then( (topicEndpoint) => {
				expect(topicEndpoint.data.topicEndpointName).to.equal(topicEndpointName);
				expect(topicEndpoint.meta.responseCode).to.equal(200);
				topicEndpoint.data.maxSpoolUsage = 0;
				return sc.updateTopicEndpoint(vpnname, topicEndpoint.data);
			})
			.then( (queue) => {
				expect(queue.ok).to.equal(true);
			});
	});
});

describe('#SempClient.createAclProfile', function() {
	it('should create a valid acl-profile in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.createAclProfile (vpnname, aclname)
			.then( (acl) => {
				expect(acl.body.data.aclProfileName).to.equal(aclname);
				expect(acl.ok).to.equal(true);
			});
	});
});
describe('#SempClient.getAclProfile', function() {
	it('should retreive a valid acl-profile in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getAclProfile (vpnname, aclname)
			.then( (acl) => {
				expect(acl.data.aclProfileName).to.equal(aclname);
				expect(acl.meta.responseCode).to.equal(200);
			});
	});
});
describe('#SempClient.updateAclProfile', function() {
	it('should successfully modify a valid ACL-Profile in a msgvpn via HTTP PUT of a valid record', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		var exlist = [
		{
			'aclProfileName': aclname, 
			'msgVpnName': vpnname,
			'clientConnectExceptionAddress': '1.1.1.1/24'
		},
		{
			'aclProfileName': aclname, 
			'msgVpnName': vpnname,
			'clientConnectExceptionAddress': '2.2.2.2/24'
		}];
		return sc.updateAclProfileConnectionExceptionsList(vpnname, exlist)
			.then( (exc) => {
				expect(exc.ok).to.equal(true);
				expect(exc.body.data.clientConnectExceptionAddress).to.equal('2.2.2.2/24');
			});
	});
});

describe('#SempClient.createClientProfile', function() {
	it('should create a valid client-profile in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.createClientProfile (vpnname, cpname)
			.then( (cp) => {
				expect(cp.body.data.clientProfileName).to.equal(cpname);
				expect(cp.ok).to.equal(true);
			});
	});
});
describe('#SempClient.getClientProfile', function() {
	it('should retreive a valid client-profile in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getClientProfile (vpnname, cpname)
			.then( (cp) => {
				expect(cp.data.clientProfileName).to.equal(cpname);
				expect(cp.meta.responseCode).to.equal(200);
			});
	});
});
describe('#SempClient.updateClientProfile', function() {
	it('should successfully modify a valid client-Profile in a msgvpn via HTTP PUT of a valid record', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getClientProfile (vpnname, cpname)
			.then( (cp) => {
				expect(cp.data.clientProfileName).to.equal(cpname);
				expect(cp.meta.responseCode).to.equal(200);
				//console.log('Modifying existing client-profile ' + cpname);
				cp.data.elidingDelay = 100;
				return sc.updateClientProfile(vpnname, cp.data);
			})
			.then( (cp) => {
				expect(cp.ok).to.equal(true);
			});
	});
});

describe('#SempClient.createClientUsername', function() {
	it('should create a valid client-Username in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.createClientUsername (vpnname, username)
			.then( (user) => {
				expect(user.body.data.clientUsername).to.equal(username);
				expect(user.ok).to.equal(true);
			});
	});
});
describe('#SempClient.getClientUsername', function() {
	it('should retrieve a valid client-Username in a msgvpn by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getClientUsername (vpnname, username)
			.then( (user) => {
				expect(user.data.clientUsername).to.equal(username);
				expect(user.meta.responseCode).to.equal(200);
			});
	});
});
describe('#SempClient.updateClientUsername', function() {
	it('should successfully modify a valid client-Username in a msgvpn via HTTP PUT of a valid record', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.getClientUsername (vpnname, username)
			.then( (user) => {
				expect(user.data.clientUsername).to.equal(username);
				expect(user.meta.responseCode).to.equal(200);
				//console.log('Modifying existing client-username ' + username);
				user.data.aclProfileName = aclname;
				user.data.clientProfileName = cpname;
				return sc.updateClientUsername(vpnname, user.data);
			})
			.then( (user) => {
				expect(user.ok).to.equal(true);
			});
	});
});

describe('#SempClient.deleteMsgVpnAndAllEntities', function() {
	it('should delete a valid msgvpn and all entities by name', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
		return sc.deleteMsgVpnAndAllEntities(vpnname)
			.then( (x) => {
				expect(x.ok).to.equal(true);
			});
	});
});

describe('#SempClient.restoreMsgVpn', function() {
	it('should restore a valid msgvpn from a dump file', function() {
		var sc = new semp.SempClient(TESTHOST, TESTUSER, TESTPASS);
	
		fs.readFile('vpn.json', 'utf8', function (err,data) {
			if (err) { return console.log(err); }
			var vpn = JSON.parse(data);
			var vmr = new semp.SempClient(host, user, pass);
			vmr.restoreMsgVpn( vpn )
				.then( (x) => {
					return sc.deleteMsgVpnAndAllEntities('jimmy_vpn')
				})
				.then( (x) => {
					expect(x.ok).to.equal(true);
				});
		});
	});
});

