const COLORS = {
    standard: "white",
    football: "orange",
    classic: "white"
};

const SPEED_INCREASE_FACTOR = 1.05;

export default class Ball {
    constructor(x, y, moveX, moveY, theme, table) {
        this.moveX = moveX;
        this.moveY = moveY;
        this.theme = theme;
        this.size = this.theme === "classic" ? 15 : 10;
        this.x = x;
        this.y = y;
        this.pas = [];
        this.table = table;
    }
    draw = (ctx) => {
        ctx.fillStyle = COLORS[this.theme];
    
        this.x += this.moveX;
        this.y += this.moveY;

        if (this.theme === "classic") {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
        }
    
        // Draw a single pixel at the x position of the ball
        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, 1, 1);
    }

    detectCollision = (paddle) => {
        let paddleTop = paddle.y;
        let paddleBottom = paddle.y + paddle.height;
        let paddleLeft = paddle.x;
        let paddleRight = paddle.x + paddle.width;
    
        let ballTop = this.theme === "classic" ? this.y : this.y - this.size;
        let ballBottom = this.y + this.size;
        let ballLeft = this.theme === "classic" ? this.x : this.x - this.size;
        let ballRight = this.x + this.size;
    
        // Check for collision on each side
        if (ballRight >= paddleLeft && ballLeft <= paddleRight && ballBottom >= paddleTop && ballTop <= paddleBottom) {
            // Ball is colliding from the left
            if (ballRight >= paddleLeft && paddle.playerIndex === 1) {
                this.x = paddleLeft + paddle.width + this.size;
            }
            // Ball is colliding from the right
            else if (ballLeft <= paddleRight && paddle.playerIndex === 2) {
                this.x = paddleRight - this.size - paddle.width;
            }
            return true;
        }
        return false;
    }
    

    bounceOnPaddles= (paddle) => {
        if (this.detectCollision(paddle)){
            console.log("bounce on paddle")
            this.moveX = -this.moveX;
            this.moveY *= SPEED_INCREASE_FACTOR;
        }
    }
    
    bounceOnWalls = (tableHeight) => {
        if (this.y - this.size <= 0 || this.y + this.size >= tableHeight){
            console.log("bounce on wall")
            this.moveY *= -1;
        }
    }
    
    increaseSpeed = () => {
        this.moveX *= SPEED_INCREASE_FACTOR;
        this.moveY *= SPEED_INCREASE_FACTOR;
    }
    
    reset = (table) => {
        // let direction = Math.random() >  0.5 ? -1 : 1;
        this.x = table.tableWidth / 2;
        this.y = getRandomInt(this.size, table.tableHeight - this.size);
    }
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
    // newParticals() {
    //     var pasCount = Math.ceil(Math.pow(this.size, 2) * Math.PI);
    
    //     for (var i = 0; i < pasCount; i++) {
    //         var pas = {};
    //         pas.x = this.x * this.table.tableWidth;
    //         pas.y = this.y * this.table.tableHeight;
    
    //         var a = Math.random() * 4;
    //         var s = Math.random() * 10;
    
    //         pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
    //         pas.yoff = s * Math.sin(a * (Math.PI / 2));
    
    //         pas.color = "white";
    //         pas.size = 10;
    
    //         if (this.pas.length < 1000) this.pas.push(pas);
    //     }
    // }

    // drawParticals(ctx) {
    //     this.newParticals();
    //     var dt = 1;
    //     for (let ix in this.pas) {
    //         var pas = this.pas[ix];
    
    //         ctx.beginPath();
    //         ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
    //         ctx.fillStyle = 'white';
    //         ctx.fill();
    
    //         pas.x -= pas.xoff;
    //         pas.y -= pas.yoff;
    //         pas.xoff -= pas.xoff * dt * 0.001;
    //         pas.yoff -= (pas.yoff + 5) * dt * 0.00005;
    //         pas.size -= (dt * 0.02 * Math.random());
    
    //         if (pas.y > this.table.tableHeight || pas.y < -50 || pas.size <= 0) pas.splice(ix, 1);
    //     }
    // }