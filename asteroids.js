let canvas;
let ctx;
let canvasWidth = 1400;
let canvasHeight = 1000;
let keys = []; // to allow user to strike multiple keys at once, need an array

document.addEventListener('DOMContentLoaded', SetupCanvas); // function whenever page is loaded

function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    document.body.addEventListener("keydown", function(e){
        keys[e.keyCode] = true;
    }); // whatever keys are down, make true
    document.body.addEventListener("keyup", function(e){
        keys[e.keyCode] = false;
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
        let radians = this.angle / Math.PI * 180
        for(let i = 0; i < 3; i++){
            ctx.lineTo(this.x - this.radius * Math.cos(vertAngle * i + radians), this.y - this.radius * Math.sin(vertAngle * i + radians));    
        }
        ctx.closePath();
        ctx.stroke();
    }
}

let ship = new Ship();

// Render() updates position of objects on canvas
function Render(){
    ship.movingForward = (keys[87]); // 'w' key down
    if(keys[68]){ //'d' key down
        ship.Rotate(1);
    }

    if(keys[65]){ //'a' key down
        ship.Rotate(-1);
    }

    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    ship.Update();
    ship.Draw();

    requestAnimationFrame(Render); // call Render() repeatedly
}
