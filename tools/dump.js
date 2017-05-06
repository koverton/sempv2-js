var semp = require('sempv2-js');
var fs = require('fs')

if (process.argv.length < 5) {
	console.log('\n\n\tUSAGE: ' + process.argv[1] + ' <host+port> <adminuser> <admin-password> <vpnname>\n\n');
	process.exit(1);
}
const host = process.argv[2];
const user = process.argv[3];
const pass = process.argv[4];
const vpnname= process.argv[5];

	var vmr = new semp.SempClient(host, user, pass);
	vmr.dumpMsgVpn( vpnname )
		.then( (vpn) => {
			vmr.prettyprint( vpn );
		})
		.catch( (err) => { console.log('ERR: ' + err); });
