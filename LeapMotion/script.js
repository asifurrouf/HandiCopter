require('leapjs/template/entry');

var MAX_PITCH = 5; // 
var MAX_ROLL = 5; // using hand.roll()
var MAX_THRUST = 10; // y of avg fingers and hand.

var controller = new Leap.Controller();

function onControllerConnect() {

	console.log('Successfully connected.');

}

function enhanceIBox(iBox) {
	// this is the Leap interaction box
	var top = iBox.center[1] + iBox.size[1] / 2;
	var left = iBox.center[0] - iBox.size[0] / 2;
	iBox.top = top;
	iBox.left = left;
	iBox.bottom = iBox.center[1] - iBox.size[1] / 2;
	return iBox;
}

function leapToChopperScale(frame, leapPos) {
	var iBox = enhanceIBox(frame.interactionBox);

	var x = leapPos[0] - iBox.left;
	var y = leapPos[1] - iBox.bottom;

	x /= iBox.size[0];
	y /= iBox.size[1];

	x *= MAX_THRUST;
	y *= MAX_THRUST;

	return [x, y];
}

function getThrust(allChopperPos) {
	var avg = 0;
	avg += allChopperPos.hand[1];
	var fingers = allChopperPos.fingers;
	for (var i = 0; i < fingers.length; i++) {
		var finger = fingers[i];
		avg += finger[1];
	}
	avg /= fingers.length + 1;
	if (avg < 0) avg = 0;
	if (avg > MAX_THRUST) avg = MAX_THRUST;
	avg = Math.floor(avg);
	return avg;
}

function getRoll(hand) {
	var roll = hand.roll();
	roll *= 3; // 1/3 PI is max roll
	roll /= Math.PI;
	roll *= MAX_ROLL;
	if (roll < -MAX_ROLL) roll = -MAX_ROLL;
	if (roll > MAX_ROLL) roll = MAX_ROLL;
	roll = Math.floor(roll);
	roll = -roll; // right roll is positive.
	return roll;
}

function getPitch(hand) {
	var pitch = hand.pitch();
	pitch *= 4; // 1/4 PI is max pitch
	pitch /= Math.PI;
	pitch *= MAX_PITCH;
	if (pitch < -MAX_PITCH) pitch = -MAX_PITCH;
	if (pitch > MAX_PITCH) pitch = MAX_PITCH;
	pitch = Math.floor(pitch);
	return pitch;
}

function writeChopperComamnds(thrust, roll, pitch) {
	console.log('Thrust:' + thrust + ', Roll: ' + roll + ', Pitch: ' + pitch);
}

function writeThrust(thrust) {
	console.log('Thrust: ' + thrust);
}

function writeRoll(roll) {
	console.log('Roll: ' + roll);
}

function writePitch(pitch) {
	console.log('Pitch: ' + pitch);
}

controller.on('connect', onControllerConnect);

controller.on('deviceConnected', function() {

	console.log('A Leap device has been connected.');

});

controller.on('deviceDisconnected', function() {

	console.log('A Leap device has been disconnected.');

});

controller.on('ready', function() {
	console.log('Leap device is ready.');
});

controller.on('frame', function(frame) {

	for (var i = 0; i < frame.hands.length; i++) {
		var hand = frame.hands[i];

		// getting the hand position
		var chopperHandPos = leapToChopperScale(frame, hand.palmPosition);

		var allChopperPos = {};
		allChopperPos.hand = chopperHandPos;
		allChopperPos.fingers = [];
		for (var j = 0; j < hand.fingers.length; j++) {
			var finger = hand.fingers[j];

			// getting finger position
			var chopperFingerPos = leapToChopperScale(frame, finger.tipPosition);
			allChopperPos.fingers[j] = chopperFingerPos;

		}
		var thrust = getThrust(allChopperPos);
		var roll = getRoll(hand);
		var pitch = getPitch(hand);
		writeChopperComamnds(thrust, roll, pitch);
		// writeThrust(thrust);
		// writeRoll(roll);
		// writePitch(pitch);

	}
});

controller.connect();