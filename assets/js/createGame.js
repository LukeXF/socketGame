var myGamePiece;
var myObstacle;
var myObstacles = [];
var myScore;
var myBackground;
var gameArea = document.getElementById("game");

console.log(gameArea);
console.log(document);

function startGame() {
	myGamePiece = new Component(30, 30, "assets/img/smiley.gif", 10, 120, "image");
	myObstacle = new Component(10, 200, "green", 300, 120);
	myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
	myBackground = new Component(500, 300, "assets/img/bg.png", 0, 0, "background");
	console.log("start game");
	myGameArea.start();
}

var myGameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		this.canvas.width = 480;
		this.canvas.height = 270;
		this.context = this.canvas.getContext("2d");
		gameArea.appendChild(this.canvas);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 20);
		window.addEventListener('keydown', function (e) {
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = true;
		});
		window.addEventListener('keyup', function (e) {
			myGameArea.keys[e.keyCode] = false;
		})
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	stop: function () {
		clearInterval(this.interval);
	}
};


function Component(width, height, color, x, y, type) {
	this.type = type;
	if (type === "image" || type === "background") {
		this.image = new Image();
		this.image.src = color;
		console.log(this.image);
	}

	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function () {
		ctx = myGameArea.context;
		if (type === "image" || type === "background") {
			ctx.drawImage(this.image,
				this.x,
				this.y,
				this.width, this.height);
			if (type === "background") {
				ctx.drawImage(this.image,
					this.x + this.width, this.y, this.width, this.height);
			}
		} else if (this.type === "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
			ctx.fillStyle = color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
		}
	};
	this.newPos = function () {
		this.x += this.speedX;
		this.y += this.speedY;
		if (this.type === "background") {
			if (this.x === -(this.width)) {
				this.x = 0;
			}
		}
	};
	this.crashWith = function (otherObj) {
		var myleft = this.x;
		var myright = this.x + (this.width);
		var mytop = this.y;
		var mybottom = this.y + (this.height);
		var otherleft = otherObj.x;
		var otherright = otherObj.x + (otherObj.width);
		var othertop = otherObj.y;
		var otherbottom = otherObj.y + (otherObj.height);
		var crash = true;
		if ((mybottom < othertop) ||
			(mytop > otherbottom) ||
			(myright < otherleft) ||
			(myleft > otherright)) {
			crash = false;
		}
		return crash;
	}
}

function updateGameArea() {
	var x, height, gap, minHeight, maxHeight, minGap, maxGap;
	for (i = 0; i < myObstacles.length; i += 1) {
		if (myGamePiece.crashWith(myObstacles[i])) {
			myGameArea.stop();
			return;
		}
	}
	myGameArea.clear();


	myBackground.speedX = -1;
	myBackground.newPos();
	myBackground.update();
	myGameArea.frameNo += 1;
	if (myGameArea.frameNo === 1 || everyinterval(150)) {
		x = myGameArea.canvas.width;
		minHeight = 20;
		maxHeight = 200;
		height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
		minGap = 50;
		maxGap = 200;
		gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
		myObstacles.push(new Component(10, height, "green", x, 0));
		myObstacles.push(new Component(10, x - height - gap, "green", x, height + gap));
	}
	for (i = 0; i < myObstacles.length; i += 1) {
		myObstacles[i].speedX = -1;
		myObstacles[i].newPos();
		myObstacles[i].update();
	}


	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
	myGamePiece.image.src = "assets/img/smiley.gif";
	if (myGameArea.keys && myGameArea.keys[37]) {
		myGamePiece.speedX = -1;
		myGamePiece.image.src = "assets/img/angry.gif";
	}
	if (myGameArea.keys && myGameArea.keys[39]) {
		myGamePiece.speedX = 1;
		myGamePiece.image.src = "assets/img/angry.gif";
	}
	if (myGameArea.keys && myGameArea.keys[38]) {
		myGamePiece.speedY = -1;
		myGamePiece.image.src = "assets/img/angry.gif";
	}
	if (myGameArea.keys && myGameArea.keys[40]) {
		myGamePiece.speedY = 1;
		myGamePiece.image.src = "assets/img/angry.gif";
	}


	myScore.text = "SCORE: " + myGameArea.frameNo;
	myScore.update();
	myGamePiece.newPos();
	myGamePiece.update();


}
function everyinterval(n) {
	if ((myGameArea.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}


