var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;
var MAX_PITCH = 5; // 
var MAX_ROLL = 5; // using hand.roll()
var MAX_THRUST = 10; // y of avg fingers and hand.

c.font = "30px Arial";
c.textAlign = 'center';
c.textBaseline = 'middle';
var controller = new Leap.Controller();

var handColor = "#FFA040";
var fingerColor = "#39AECF";

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

function leapToScene(frame, leapPos) {
	var iBox = enhanceIBox(frame.interactionBox);

	var x = leapPos[0] - iBox.left;
	var y = leapPos[1] - iBox.top;

	// scale leap space to canvas size
	x /= iBox.size[0];
	y /= iBox.size[1];
	x *= width;
	y *= height;

	// canvase y in going down
	return [x, -y];

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

function writeThrust(thrust) {
	document.querySelector('#thrust span').innerHTML = thrust;
	console.log('Thrust: ' + thrust);
}

function writeRoll(roll) {
	document.querySelector('#roll span').innerHTML = roll;
	console.log('Roll: ' + roll);
}

function writePitch(pitch) {
	document.querySelector('#pitch span').innerHTML = pitch;
	console.log('Pitch: ' + pitch);
}

function drawConnectionLine(handPos, fingerPos) {
	// line connects hand and fingers style
	c.strokeStyle = handColor;
	c.lineWidth = 3;

	// draw the line
	c.beginPath();
	c.moveTo(handPos[0], handPos[1]);
	c.lineTo(fingerPos[0], fingerPos[1]);
	c.closePath();
	c.stroke();
}

function drawFinger(fingerPos) {
	// setting the stroke style
	c.strokeStyle = fingerColor;
	c.lineWidth = 5;

	// sraw the finger circle
	c.beginPath();
	c.arc(fingerPos[0], fingerPos[1], 6, 0, Math.PI * 2);
	c.closePath();
	c.stroke();
}

function drawHand(handPos) {
	// setting the fill color
	c.fillStyle = handColor;

	// drawing a circle
	c.beginPath();
	c.arc(handPos[0], handPos[1], 10, 0, Math.PI * 2);
	c.closePath();
	c.fill();
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

	c.clearRect(0, 0, width, height);

	for (var i = 0; i < frame.hands.length; i++) {
		var hand = frame.hands[i];

		// getting the hand position
		var canvasHandPos = leapToScene(frame, hand.palmPosition);
		var chopperHandPos = leapToChopperScale(frame, hand.palmPosition);

		var allChopperPos = {};
		allChopperPos.hand = chopperHandPos;
		allChopperPos.fingers = [];
		for (var j = 0; j < hand.fingers.length; j++) {
			var finger = hand.fingers[j];

			// getting finger position
			var fingerPos = leapToScene(frame, finger.tipPosition);
			var chopperFingerPos = leapToChopperScale(frame, finger.tipPosition);
			allChopperPos.fingers[j] = chopperFingerPos;

			drawConnectionLine(canvasHandPos, fingerPos);
			drawFinger(fingerPos);
			drawHand(canvasHandPos);

		}
		var thrust = getThrust(allChopperPos);
		var roll = getRoll(hand);
		var pitch = getPitch(hand);
		writeThrust(thrust);
		writeRoll(roll);
		writePitch(pitch);

	}
});

controller.connect();