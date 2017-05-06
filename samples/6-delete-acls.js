var semp = require('sempv2-js');

/***
if (process.argv.length < 6) {
	console.log('\n\n\tUSAGE: ' + process.argv[1] + ' <host+port> <adminuser> <admin-password> <vpnname> <aclname>\n\n');
	process.exit(1);
}
***/
const process.argv[2];
const process.argv[3];
const process.argv[4];
const process.argv[5];
const process.argv[6];


var vmr = new semp.SempClient(host, user, pass);

console.log('Deleting acl ' + aclname);
vmr.deleteAclProfile(vpnname, aclname)
	.then( (x) => {
		prettyprint(x);
	})
	.catch( (err) => { console.log('ERR: ' + err); });

function prettyprint(obj) {
	console.log(JSON.stringify(obj, null, 2));
}

