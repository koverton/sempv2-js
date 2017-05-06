var semp = require('sempv2-js');

/***
if (process.argv.length < 6) {
	console.log('\n\n\tUSAGE: ' + process.argv[1] + ' <host+port> <adminuser> <admin-password> <vpnname> <aclname>\n\n');
	process.exit(1);
}
***/
const host = process.argv[2];
const user = argv[3];
const pass = argv[4];
const vpnname= argv[5];
const aclname= argv[6];

var vmr = new semp.SempClient(host, user, pass);

console.log('Creating acl ' + aclname);
vmr.createAclProfile(vpnname, aclname)
	.then( (acl) => {
		prettyprint(acl);
		var exlist = [
		{
			"aclProfileName": aclname, 
			"msgVpnName": vpnname,
			"clientConnectExceptionAddress": "1.1.1.1/24"
		},
		{
			"aclProfileName": aclname, 
			"msgVpnName": vpnname,
			"clientConnectExceptionAddress": "2.2.2.2/24"
		}];
		return vmr.updateAclProfileConnectionExceptionsList(vpnname, exlist);
	})
	.then( (acl) => {
		prettyprint(acl);
		return vmr.getAclProfileSubscribeExceptionsList(vpnname, aclname)
	})
	.then( (acl) => {
		prettyprint(acl);
		acl.data.push({
			"aclProfileName": aclname, 
			"msgVpnName": vpnname,
			"subscribeExceptionTopic": "1/2/>",
			"topicSyntax": "smf"
		});
		acl.data.push({
			"aclProfileName": aclname, 
			"msgVpnName": vpnname,
			"subscribeExceptionTopic": "3/4/>",
			"topicSyntax": "smf"
		});
		return vmr.updateAclProfileSubscribeExceptionsList(vpnname, acl.data);
	})
	.then( (acl) => {
		prettyprint(acl);
		return vmr.getAclProfilePublishExceptionsList(vpnname, aclname)
	})
	.then( (acl) => {
		prettyprint(acl);
		acl.data.push({
			"aclProfileName": aclname, 
			"msgVpnName": vpnname,
			"publishExceptionTopic": "5/6/>",
			"topicSyntax": "smf"
		});
		return vmr.updateAclProfilePublishExceptionsList(vpnname, acl.data);
	})
	.then( (acl) => {
		prettyprint(acl);
		return vmr.deleteAclProfilePublishException(vpnname, acl.body.data);
	})
	.then( (acl) => {
		prettyprint(acl);
		return vmr.deleteAclProfile(vpnname, aclname)
	})
	.catch( (err) => { console.log('ERR: ' + err); });

function prettyprint(obj) {
	console.log('\n\n');
	console.log(JSON.stringify(obj, null, 2));
	console.log('\n\n');
}
