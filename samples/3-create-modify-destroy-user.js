var semp = require('sempv2-js');

if (process.argv.length < 7) {
	console.log('\n\n\tUSAGE: ' + process.argv[1] + ' <host+port> <adminuser> <admin-password> <vpn> <username>\n\n');
	process.exit(1);
}
const host = process.argv[2];
const user = process.argv[3];
const pass = process.argv[4];
const vpnname = process.argv[5];
const username = process.argv[6];

var vmr = new semp.SempClient(host, user, pass);

console.log('Creating client-username ' + username + ' on msg-vpn ' + vpnname);
vmr.createClientUsername(vpnname, username)
	.then( (user) => {
		if(user == null || !user.ok) {
			console.log('Client-Username create failed!');
			return user;
			prettyprint(user);
		}
		console.log('Modifying existing client-username ' + username);
		user.body.data.subscriptionManagerEnabled = true;
		return vmr.updateClientUsername(vpnname, user.body.data);
	})
	.then( (user) => {
		if(user == null || !user.ok) {
			console.log('Client-Username modify failed!');
			prettyprint(user);
		}
		console.log('Deleting existing client-username ' + username);
		return vmr.deleteClientUsername(vpnname, username);
	})
	.then( (x) => {
		if(x == null || !x.ok) {
			console.log('Client-Username delete failed!');
			prettyprint(x);
		}
	})
	.catch( (err) => { console.log('ERR: ' + err); });

function prettyprint(obj) {
	console.log(JSON.stringify(obj, null, 2));
}
