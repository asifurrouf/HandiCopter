var canvas = document.getElementById('canvas');
var c = canvas.getContext('2d');
var width = canvas.width;
var height = canvas.height;

c.font = "30px Arial";
c.textAlign = 'center';
c.textBaseline = 'middle';
var controller = new Leap.Controller();

var handColor = "#FFA040";
var fingerColor = "#39AECF";

function onControllerConnect() {

	console.log('Successfully connected.');

}

function leapToScene(frame, leapPos) {
	// this is the Leap interaction box
	var iBox = frame.interactionBox;

	var top = iBox.center[1] + iBox.size[1] / 2;
	var left = iBox.center[0] - iBox.size[0] / 2;

	var x = leapPos[0] - left;
	var y = leapPos[1] - top;

	// scale leap space to canvas size
	x /= iBox.size[0];
	y /= iBox.size[1];
	x *= width;
	y *= height;

	// canvase y in going down
	return [x, -y];

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
		var handPos = leapToScene(frame, hand.palmPosition);


		for (var j = 0; j < hand.fingers.length; j++) {
			var finger = hand.fingers[j];

			// getting finger position
			var fingerPos = leapToScene(frame, finger.tipPosition);

			drawConnectionLine(handPos, fingerPos);
			drawFinger(fingerPos);
			drawHand(handPos);

		}
	}
	// var numberOfFingers = frame.fingers.length;
	// c.fillText(numberOfFingers, width / 2, height / 2);
	// console.log('numberOfFingers :' + numberOfFingers)

});

controller.connect();