var dgram = require('dgram');
var PORT = 33333;
var HOST = '127.0.0.1';
var gpio = require('rpi-gpio');

var server = dgram.createSocket('udp4');

server.on('listening', function () {
    var address = server.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

server.on('message', function (message, remote) {
    console.log(remote.address + ':' + remote.port +' - ' + message);
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
    gpio.destroy(function() {
        console.log('All pins unexported');
        return process.exit(0);
    });
}

server.bind(PORT, HOST);