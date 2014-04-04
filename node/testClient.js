var dgram = require('dgram');

var PORT = 33333;
var HOST = '127.0.0.1';

var udp_client = dgram.createSocket('udp4');

function test_send() {
	console.log("sending message");
	var buf = new Buffer("test_msg");
	udp_client.send(buf, 0, buf.length, PORT, HOST, function(err, bytes) {
		if (err) throw err;
		console.log('UDP message sent to ' + HOST + ':' + PORT);
	});
}

for (var i = 0; i < 100; i++) {
	setTimeout(test_send, 1000/60);
}