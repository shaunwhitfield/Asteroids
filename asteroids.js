let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let ship;
let keys = []; // to allow user to strike multiple keys at once, need an array
let bullets = [];
let asteroids = [];

document.addEventListener('DOMContentLoaded', SetupCanvas); // function whenever page is loaded

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ship = new Ship();

    for(let i = 0; i < 8; i++){
      asteroids.push(new Asteroid);
    }
    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
        console.log(e.keyCode);
    }); // whatever keys are down, make true
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
        if(e.keyCode === 32){
          bullets.push(new Bullet(ship.angle));
        }

        if(e.keyCode === 16){
            ship.speed = 0.1;
        }
    }); // return key to false when back up

    Render();
}

class Ship {
    constructor(){
        this.visible = true;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.movingForward = false;
        this.speed = 0.1;
        this.velX = 0;
        this.velY = 0;
        this.rotationSpeed = 0.001;
        this.radius = 15;
        this.angle = 0;
        this.strokeColor = 'white';
        this.noseX = canvasWidth / 2 + 15;
        this.noseY = canvasHeight / 2;
    }

    Rotate(dir){
        this.angle += this.rotationSpeed * dir;
    }

    // Update() handles rotating and moving the ship around
    Update(){
        // get current facing and convert it to radians
        let radians = this.angle / Math.PI * 180;

        if(this.movingForward){
            // oldX + cos(radians) * distance
            this.velX += Math.cos(radians) * this.speed;
            // oldY + sin(radians) * distance
            this.velY += Math.sin(radians) * this.speed;
        }

        if(this.movingBackward){
            // oldX + cos(radians) * distance
            this.velX += Math.cos(radians) * this.speed * -1;
            // oldY + sin(radians) * distance
            this.velY += Math.sin(radians) * this.speed * -1;
        }

        // travel off of left of screen
        if(this.x < this.radius){
            this.x = canvas.width;
        }

        // travel off of right of screen
        if(this.x > canvas.width){
            this.x = this.radius;
        }

        // travel off of bottom of screen
        if(this.y < this.radius){
            this.y = canvas.height;
        }

        //travel off of top of screen
        if(this.y > canvas.height){
            this.y = this.radius;
        }

        // slow ship when key not held
        this.velX *= 0.99;
        this.velY *= 0.99;

        this.x -= this.velX;
        this.y -= this.velY;
    }

    Draw(){
        ctx.strokeStyle = this.strokeColor;
        ctx.beginPath();
        let vertAngle = ((Math.PI * 2) / 3);
        //convert degrees to radians
        let radians = this.angle / Math.PI * 180;
        this.noseX = this.x - this.radius * Math.cos(radians);
        this.noseY = this.y - this.radius * Math.sin(radians);
        for(let i = 0; i < 3; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
             this.y - this.radius * Math.sin(vertAngle * i + radians));
        }
        ctx.closePath();
        ctx.stroke();
    }
}

class Bullet{
  constructor(angle){
    this.visible = true;
    this.x = ship.noseX;
    this.y = ship.noseY;
    this.angle = angle;
    this.height = 4;
    this.width = 4;
    this.speed = 5;
    this.velX = 0;
    this.VelY = 0;
  }

  Update(){
    // get current facing and convert it to radians
    let radians = this.angle / Math.PI * 180;
    this.x -= Math.cos(radians) * this.speed;
    this.y -= Math.sin(radians) * this.speed;
  }

  Draw(){
    ctx.fillStyle = 'white';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Asteroid{
  constructor(x,y){
    this.visible = true;
    this.x = Math.floor(Math.random() * canvasWidth);
    this.y = Math.floor(Math.random() * canvasHeight);
    this.speed = 1;
    this.radius = 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = 'white';
  }

  Update(){
    let radians = this.angle / Math.PI * 180;
    this.x += Math.cos(radians) * this.speed;
    this.y += Math.sin(radians) * this.speed;

    // travel off of left of screen
    if(this.x < this.radius){
        this.x = canvas.width;
    }

    // travel off of right of screen
    if(this.x > canvas.width){
        this.x = this.radius;
    }

    // travel off of bottom of screen
    if(this.y < this.radius){
        this.y = canvas.height;
    }

    //travel off of top of screen
    if(this.y > canvas.height){
        this.y = this.radius;
    }
  }

  Draw(){
    ctx.beginPath();
    let vertAngle = ((Math.PI * 2) / 6);
    //convert degrees to radians
    let radians = this.angle / Math.PI * 180;
    this.noseX = this.x - this.radius * Math.cos(radians);
    this.noseX = this.y - this.radius * Math.sin(radians);
    for(let i = 0; i < 6; i++){
        ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians),
         this.y - this.radius * Math.sin(vertAngle * i + radians));
    }
    ctx.closePath();
    ctx.stroke();
  }
}

// Render() updates position of objects on canvas
function Render(){
    ship.movingForward = (keys[87]); // 'w' key down
    ship.movingBackward = (keys[83]); // 's' key down

    if(keys[68]){ //'d' key down
        ship.Rotate(1);
    }

    if(keys[65]){ //'a' key down
        ship.Rotate(-1);
    }

    if(keys[16]){ //'a' key down
        ship.speed = 0.3;
    }

    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ship.Update();
    ship.Draw();

    if(bullets.length !== 0){
      console.log(bullets.length);
      for(let i = 0; i < bullets.length; i++){
        bullets[i].Update();
        bullets[i].Draw();
      }
    }

    if(asteroids.length !== 0){
      for(let i = 0; i < asteroids.length; i++){
        asteroids[i].Update();
        asteroids[i].Draw();
      }
    }

    requestAnimationFrame(Render); // call Render() repeatedly
}
