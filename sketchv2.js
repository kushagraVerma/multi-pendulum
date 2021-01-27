let p;

let canvas;

let framerate = 24;
let capturer = new CCapture({format: 'webm',framerate,name: 'pend',quality: 100});

function setup() {
	let c = createCanvas(600,600);
	background(0);
	frameRate(framerate);
	colorMode(HSB);
	canvas = c.canvas;
	p = new Pendulum(8);
	// capturer.start();
}

function draw(){
	background(0);

	p.update();
	p.display();

	// capturer.capture(canvas);
	// if(frameCount==24*60){
	// 	capturer.stop();
	// 	capturer.save();
	// 	noLoop();
	// }
}