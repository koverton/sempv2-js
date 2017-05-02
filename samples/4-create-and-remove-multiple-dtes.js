var semp = require('sempv2-js');

if (process.argv.length < 7) {
	console.log('\n\n\tUSAGE: ' + process.argv[1] + ' <host+port> <adminuser> <admin-password> <vpn> <DTE-name>\n\n');
	process.exit(1);
}
const host = process.argv[2];
const user = process.argv[3];
const pass = process.argv[4];
const vpnname = process.argv[5];
const dte1name = process.argv[6] + '_1';
const dte2name = process.argv[6] + '_2';

var vmr = new semp.SempClient(host, user, pass);

console.log('Creating DTE1 ' + dte1name + ' on msg-vpn ' + vpnname);
vmr.createTopicEndpoint(vpnname, dte1name)
	.then( (dte) => {
		if(dte == null || !dte.ok) {
			console.log('DTE create failed!');
			prettyprint(dte);
		}
		console.log('Creating DTE2 ' + dte2name);
		return vmr.createTopicEndpoint(vpnname, dte2name);
	})
	.then( (dte) => {
		if(dte == null || !dte.ok) {
			console.log('DTE create failed!');
			prettyprint(dte);
		}
		console.log('Bulk delete of all TopicEndpoints on Msg-VPN ' + vpnname);
		return vmr.deleteAllTopicEndpoints(vpnname);
	})
	.then( (x) => {
		if(x == null || !x.ok) {
			console.log('Bulk TopicEndpoint delete failed!');
			prettyprint(x);
		}
	})
	.catch( (err) => { console.log('ERR: ' + err); });

function prettyprint(obj) {
	console.log(JSON.stringify(obj, null, 2));
}
