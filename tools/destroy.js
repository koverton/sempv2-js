#!/usr/local/bin/node

var semp = require('sempv2-js');

if (process.argv.length < 6) {
	console.log('\n\n\tUSAGE: ' + process.argv[1] + ' <host+port> <adminuser> <admin-password> <vpnname>\n\n');
	process.exit(1);
}
const host = process.argv[2];
const user = process.argv[3];
const pass = process.argv[4];
const vpnname= process.argv[5];


var vmr = new semp.SempClient(host, user, pass);

vmr.deleteMsgVpnAndAllEntities(vpnname)
	.then( (x) => {
		if(x == null || !x.ok) {
			console.log('Msg-VPN delete failed!');
		}
	})
	.catch( (err) => { console.log('ERR: ' + err); });
