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

fs.readFile('vpn.json', 'utf8', function (err,data) {
	if (err) { return console.log(err); }
	var vpn = JSON.parse(data);
	var vmr = new semp.SempClient(host, user, pass);
	vmr.restoreMsgVpn( vpn )
		.then( (x) => {
			return vmr.dumpMsgVpn( vpnname );
		})
		.then( (vpn) => {
			return vmr.deleteMsgVpnAndAllEntities( vpnname );
		})
		.catch( (err) => { console.log('ERR: ' + err); });
});
