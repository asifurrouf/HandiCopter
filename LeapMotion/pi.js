var dgram = require('dgram');
var PORT = 33333;
var HOST = '127.0.0.1';
var gpio = require('rpi-gpio');
var exec = require('child_process').exec;
var IR_DEVICE = '/root/new_recording';

var server = dgram.createSocket('udp4');
open_lirc();

server.on('listening', function() {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function(message, remote) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);
	irsend('BTN_1');
});

function open_lirc() {
	exec('sudo /etc/init.d/lirc start', function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error) {
			throw(error);
		}
		
	});
}

function irsend(key) {
	exec('irsend SEND_ONCE ' + IR_DEVICE + ' ' + key, function(error, stdout, stderr) {
		console.log('sent ' + key);
	});
}

server.bind(PORT, HOST);

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, err) {
	exec('sudo /etc/init.d/lirc stop', function(error, stdout, stderr) {
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error) {
			throw(error);
		}
		
	});
}


//do something when app is closing
process.on('exit', exitHandler.bind(null, {
	cleanup: true
}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {
	exit: true,
	cleanup: true
}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {
	exit: true
}));