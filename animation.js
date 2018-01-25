//draws as soon as the page has fully loaded its elements
$(function(){
	
//getting the canvas
const canvasToDraw = document.getElementById("myCanvas");

//creating an off-screen canvas for better performance
const canvas = document.createElement("canvas");

//setting a context to draw based on;
const ctx = canvas.getContext("2d");
const cctx = canvasToDraw.getContext("2d");

//setting the size of canvas
canvas.width = $(window).width();
canvas.height = $(window).height();
canvasToDraw.width = canvas.width;
canvasToDraw.height = canvas.height;

//creating an array
let objArray = [];

//as the name suggests
let addingNumber = 100;
let numberOfObjToCreate = 175;

//creating the object's specs
const radius = 20;
let color = [
	"#838CFF",
	"#4A33E8",
	"#4479FF",
	"#33B0E8",
	"#46FCFF"
];
let mass;
let opacity = 0.2;

//creating the user interaction mouse elements
let mouse = {
	x: undefined,
	y: undefined
}

//getting the x and y (mouse position)
window.addEventListener("mousemove", function(event){
	mouse.x = event.pageX;
	mouse.y = event.pageY;
});

//listening for any resize of page
$(window).on("resize", function(){
	
	//re-setting the size of canvas 
	canvasToDraw.width = canvas.width;
	canvasToDraw.height = canvas.height;
	canvas.width = $(window).width();
	canvas.height = $(window).height() + $("table").height();

	drawEach();
});

//Pythagorean distance formula
function getDist(obj1X, obj1Y, obj2X, obj2Y){
	let deltaX = obj1X - obj2X;
	let deltaY = obj1Y - obj2Y;
	
	return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
}

//One-dimensional Newtonian collision
//collision taken from: https://gist.github.com/christopher4lis/f9ccb589ee8ecf751481f05a8e59b1dc
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;


    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);
        const m1 = particle.mass;
        const m2 = otherParticle.mass;
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;
        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
//end of collision

//initializing an object of a ball;
function object(x, y, radius, color, mass){
	
	//using this to refer to the object's x parameter (also 'this' holds the value of x)
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.color = color;
	this.mass = mass;
	this.opacity = opacity;
	this.velocity = {
		x: Math.floor((Math.random() - 0.5) * 3),
		y: Math.floor((Math.random() - 0.5) * 3)
	}
	
	//initializing the update function that makes the object move;
	this.update = function(){
		this.x += this.velocity.x;
		this.y += this.velocity.y;
		
		//calling the functions
		this.mouseCollision();
		this.collision();
		this.draw();
	}
	
	//initializing the draw function that draws the object
	this.draw = function(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		ctx.strokeStyle = "gray";
		ctx.save();
		ctx.globalAlpha = this.opacity;
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.restore();
		ctx.stroke();
		
	}
	
	//initializing the collision function that detects collision
	this.collision = function(){
		for(let i = 0; i < objArray.length; i++){
			if( this === objArray[i]) continue;
			
			if(getDist(this.x, this.y, objArray[i].x, objArray[i].y) 
			- this.radius - objArray[i].radius - 5 < 0){
				resolveCollision(this, objArray[i]);
			}
		}
		
		if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
			this.velocity.x = -this.velocity.x;
		}
		
		if(this.y + this.radius > canvas.height || this.y - this.radius < 0){
			this.velocity.y = -this.velocity.y;
		}
	}
	
	//detects whenever the mouse moves over an object
	this.mouseCollision = function(){
		if(getDist(mouse.x, mouse.y, this.x, this.y) - this.radius - 100 < 0){
			this.opacity += 0.06;
		}else{
			if(this.opacity > 0.2)
				this.opacity = 0.2;
		}
	}
}

//creating the object
function drawEach(){
	
	//clearing the array every time the page reloads or resizes
	objArray = [];
	
	//creating each object
	for(let i = 0; i < numberOfObjToCreate; i++){
		x = Math.floor(Math.random() * (canvas.width - radius * 2) + radius);
		y = Math.floor(Math.random() * (canvas.height  - radius * 2) + radius);
		mass = 1;
		
		/*color = 'rgba(' + Math.floor(Math.random() * 256) + ',' + 
		Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256)
		+ ',' + '0.7)';*/
		
		//checking if the next object spawns over the previous one	
		if(i !== 0){
			for(let j = 0; j < objArray.length; j++){
				
				//if so, reallocates the coords for the second obj
				if(getDist(x, y, objArray[j].x, objArray[j].y) - radius - objArray[j].radius - 5 < 0){
					x = Math.floor(Math.random() * (canvas.width - radius * 2) + radius);
					y = Math.floor(Math.random() * (canvas.height - radius * 2) + radius);
					
					//re-looping to check for the rest of the objects
					j = -1;
				}
			}
		}
		
		//adding each created obj to an array so that I can display all of them at once 
		//(better performance and efficiency)
		objArray.push(new object(x, y, radius, color[Math.floor(Math.random() * color.length)], mass));
	}
}

function animate(){
	//setting a frame rate
	requestAnimationFrame(animate);
	
	//clearing the canvas every time a frame has passed;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//resizing the canvas based on the height of the table
	if($("table").hasClass("hasClass")){
		canvas.height = $(window).height() + $("table").height();
		canvasToDraw.height = canvas.height;
		$("table").hasClass("hasClass", false);
		
		if($("table").hasClass("hasThirdClass")){
			$("table").toggleClass("hasThirdClass", false);
			numberOfObjToCreate += addingNumber;
			drawEach();
		}
	}else{
		if($("table").hasClass("hasSecondClass")){
			canvas.height = $(window).height();
			canvasToDraw.height = canvas.height;
			$("table").toggleClass("hasSecondClass", false);
			numberOfObjToCreate -= addingNumber;
			
			drawEach();
		}
	}
	
	//opening or closing the background drawing
	if($("a#backgrd").text() === "OFF"){
			objArray = [];
			$("a#backgrd").attr("value", "once");
	}
		
	if($("a#backgrd").text() === "ON" && $("a#backgrd").attr("value") === "once"){
		$("a#backgrd").attr("value", "");
		drawEach();
	}
	
	//redrawing the new frame
	objArray.forEach(function(elem){
		
		//each element is going to update individually
		elem.update(objArray);
	});
	
	//copying the image on the screen
	cctx.clearRect(0, 0, canvasToDraw.width, canvasToDraw.height);
	cctx.drawImage(canvas, 0, 0);
}

//calling the functions
drawEach();
animate();
});