const g = 0.01;
const dampF = 1;
const transmitF = 1;
const nextPullF = 0.1;

class Bob{
	constructor(m,l,initTheta,col,prev,next=undefined){
		this.m = m;
		this.lv = createVector(0,l);
		this.theta = initTheta;
		this.prev = prev.copy();
		this.next = next!=undefined?next.copy():next;
		this.omega = 0;
		this.alpha = 0;

		this.col = col;

		// this.pvel = createVector(0,0);
		// this.vel = createVector(0,0);
		this.pos = this.lv.copy().rotate(this.theta).add(this.prev);

		this.pts = [this.pos.copy()];
	}
	getTorque(){
		// let t = this.lv.mag()*sin(this.theta)*this.m*g;
		let t = sin(this.theta)*this.m*g;

		// t+=this.m/this.lv.mag() * p5.Vector.sub(this.vel,this.pvel).mag() * 1/50;

		if(this.next!=undefined){
			let theta2 = this.lv.angleBetween(p5.Vector.sub(this.next,this.pos));
			// t+=this.m*g*this.lv.mag()*sin(this.theta+theta2)/4 * nextPullF;
			t+=this.m*g*sin(this.theta+theta2)/4 * nextPullF;
		}

		return t;
	}
	update(pAlpha=0){
		this.alpha = -this.getTorque()/this.m+pAlpha;
		this.omega+=this.alpha;
		this.omega*=dampF;
		this.theta+=this.omega;

		// this.pvel = this.vel.copy();
		// this.vel = (this.lv.copy().rotate(this.theta-PI/2*Math.sign(this.theta))).normalize();
		// this.vel.mult(abs(this.omega)*this.lv.mag());

		this.pos = this.lv.copy().rotate(this.theta).add(this.prev);

		this.pts.push(this.pos.copy());
		if(this.pts.length>48){
			this.pts.shift();
		}
		return this.alpha;
		// console.log(floor(this.theta*180/PI*100)/100,floor(this.alpha*180/PI*100)/100);
	}
	display(){
		stroke(0,0,100);
		strokeWeight(2);
		line(this.pos.x,this.pos.y,this.prev.x,this.prev.y);
		// let v_ = p5.Vector.mult(this.vel,1);
		// v_.add(this.pos);
		// line(this.pos.x,this.pos.y,v_.x,v_.y);

		stroke(this.col,0.4);
		strokeWeight(1);
		noFill();
		beginShape();
		for(let pt of this.pts){
			curveVertex(pt.x,pt.y);
		}
		endShape();

		noStroke();
		fill(this.col);
		ellipse(this.pos.x,this.pos.y,this.m*10,this.m*10);
	}
}

const initM = 2;
const initL = 120;

function randCol() {
	// let r = floor(random(0,256));
	// let g = floor(random(0,256));
	// let b = floor(random(0,256));
	let h = floor(random(0,360));
	let s = floor(random(40,101));
	let b = floor(random(80,101));
	return color(h,s,b);
}

class Pendulum{
	constructor(n){
		this.bobs=[];
		this.bobs.push(new Bob(initM,initL,PI/2,randCol(),createVector(width/2,height/3)));
		for(let i = 1; i<n; i++){
			let pb = this.bobs[i-1];
			let b = new Bob(initM/1.4**(i/2),initL/(1.5**i),PI/2,randCol(),pb.pos.copy());
			// let b = new Bob(initM,initL,PI/2,randCol(),pb.pos.copy());
			pb.next = b.pos.copy();
			this.bobs.push(b);
		}
		this.pts = [];
	}
	update(){
		// for (let i = this.bobs.length - 1; i >= 0; i--) {
		// 	if(i<this.bobs.length - 1){
		// 		this.bobs[i].next = this.bobs[i+1].pos.copy();
		// 	}
		// 	this.bobs[i].update();
		// 	if(i<this.bobs.length - 1){
		// 		this.bobs[i+1].prev = this.bobs[i].pos.copy();
		// 	}
		// }
		let pAlpha = 0;
		for (let i = 0; i < this.bobs.length; i++) {
			pAlpha = this.bobs[i].update(pAlpha*transmitF);
			// this.bobs[i].update();
			if(i<this.bobs.length-1){
				this.bobs[i+1].prev = this.bobs[i].pos.copy();
			}
		}
		// this.pts.push(this.bobs[this.bobs.length-1].pos.copy());
		// if(this.pts.length>100){
		// 	this.pts.shift();
		// }
	}
	display(){
		// stroke(255);
		// noFill();
		// beginShape();
		// for(let pt of this.pts){
		// 	curveVertex(pt.x,pt.y);
		// }
		// endShape();
		for(let b of this.bobs){
			b.display();
		}
	}
}