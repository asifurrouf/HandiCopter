var dgram = require('dgram');
var PORT = 33333;
var HOST = '127.0.0.1';
var gpio = require('rpi-gpio');
var exec = require('child_process').exec;

var server = dgram.createSocket('udp4');
var IR_DEVICE = '/root/remote';

server.on('listening', function() {
	var address = server.address();
	console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function(message, remote) {
	console.log(remote.address + ':' + remote.port + ' - ' + message);
});

function set_pins() {
	gpio.setup(25, gpio.DIR_OUT, write);
	gpio.setup(23, gpio.DIR_OUT, write);
	gpio.setup(24, gpio.DIR_OUT, write);
}

function write(pin_num) {
	gpio.write(pin_num, true, function(err) {
		if (err) throw err;
		console.log('Written to pin_num: ' + pin_num);
	});
}

function closePins() {
	console.log("closePins");
	gpio.destroy(function() {
		console.log('All pins unexported');
	});
}

server.bind(PORT, HOST);

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, err) {
	if (options.cleanup) {
		closePins();
	}
	if (err) console.log(err.stack);
	if (options.exit) process.exit();
}

function irsend(key) {
	exec('irsend SEND_ONCE' + IR_DEVICE + ' ' + key, function(error, stdout, stderr) {
		console.log('sent ' + key);
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