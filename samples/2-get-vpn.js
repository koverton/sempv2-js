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

console.log('Querying msg-vpn ' + vpnname);
vmr.getMsgVpn(vpnname)
	.then( (vpn) => {
		if(vpn == null || !vpn.ok) {
			console.log('Msg-VPN get failed!');
			prettyprint(vpn);
		}
	})
	.catch( (err) => { console.log('ERR: ' + err); });

function prettyprint(obj) {
	console.log(JSON.stringify(obj, null, 2));
}
