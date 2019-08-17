let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let ship;
let keys = []; // to allow user to strike multiple keys at once, need an array
let bullets = [];
let asteroids = [];
let score = 0;
let lives = 3;

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
        //console.log(e.keyCode);
    }); // whatever keys are down, make true
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
        if(e.keyCode === 32){
          bullets.push(new Bullet(ship.angle));
        }

        if(e.keyCode === 16){
            ship.speed = 0.075;
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
        this.speed = 0.075;
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
  constructor(x,y,radius, level, collisionRadius){
    this.visible = true;
    this.x = x || Math.floor(Math.random() * canvasWidth);
    this.y = y || Math.floor(Math.random() * canvasHeight);
    this.speed = 2;
    this.radius = radius || 50;
    this.angle = Math.floor(Math.random() * 359);
    this.strokeColor = 'white';
    this.collisionRadius = collisionRadius || 46;
    this.level = level || 1;
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

function CircleCollisions(p1x,p1y,r1,p2x,p2y,r2){
    let radiusSum;
    let xDiff;
    let yDiff;
    radiusSum = r1 + r2;
    xDiff = p1x - p2x;
    yDiff = p1y - p2y;
    if(radiusSum > Math.sqrt((xDiff * xDiff) + (yDiff * yDiff))){
        return true;
    }else{
        return false;
    }
}

function DrawLifeShips(){
    let startX = 1350;
    let startY = 10;
    let points = [[9,9], [-9,9]];
    ctx.strokeStyle = 'white';
    for(let i = 0; i < lives; i++){
        ctx.beginPath();
        ctx.moveTo(startX,startY);
        for(let j = 0; j < points.length; j++){
            ctx.lineTo(startX + points[j][0], startY + points[j][1]);
        }
        ctx.closePath();
        ctx.stroke();
        startX -= 30;
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
        ship.speed = 0.125;
    }

    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ctx.fillStyle = 'white';
    ctx.font = '21px Arial';
    ctx.fillText('SCORE: ' + score.toString(), 20, 35);
    if(lives <= 0){
        ship.visible = false;
        ctx.fillStyle = 'white';
        ctx.font = '50px Arial';
        ctx.fillText('GAME OVER', canvasWidth /2 - 150, canvasHeight / 2);
    }
    DrawLifeShips();

    if(asteroids.length !== 0){
        for(let k = 0; k < asteroids.length; k++){
            if(CircleCollisions(ship.x, ship.y, 11, asteroids[k].x,asteroids[k].y,asteroids[k].collisionRadius)){
                ship.x = canvasWidth / 2;
                ship.y = canvasHeight / 2;
                ship.velX = 0;
                ship.velY = 0;
                lives -= 1;
            }
        }
    }

    if(asteroids.length !== 0 && bullets.length !=0){
        loop1:
            for(let l = 0; l < asteroids.length; l++){
                for(let m = 0; m < bullets.length; m++){
                    if(CircleCollisions(bullets[m].x,bullets[m].y,3,asteroids[l].x, asteroids[l].y, asteroids[l].collisionRadius)){
                        console.log("COLLISION");
                        if(asteroids[l].level === 1){
                            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5,25,2,22));
                            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5,25,2,22));
                        } else if(asteroids[l].level === 2){
                            asteroids.push(new Asteroid(asteroids[l].x - 5, asteroids[l].y - 5,15,3,12));
                            asteroids.push(new Asteroid(asteroids[l].x + 5, asteroids[l].y + 5,15,3,12));
                        }
                        asteroids.splice(l,1);
                        bullets.splice(m,1);
                        score += 20;
                        break loop1;
                    }
                }
            }
    }

    if(ship.visible){
        ship.Update();
        ship.Draw();
    }
    ship.Update();
    ship.Draw();

    if(bullets.length !== 0){
      //console.log(bullets.length);
      for(let i = 0; i < bullets.length; i++){
        bullets[i].Update();
        bullets[i].Draw();
      }
    }

    if(asteroids.length !== 0){
      for(let j = 0; j < asteroids.length; j++){
        asteroids[j].Update();
        asteroids[j].Draw(j);
      }
    }

    requestAnimationFrame(Render); // call Render() repeatedly
}
