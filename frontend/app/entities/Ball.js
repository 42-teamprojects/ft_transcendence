const COLORS = {
    standard: "white",
    football: "orange",
    classic: "white"
};

const SPEED_INCREASE_FACTOR = 0.5;

const MAX_SPEED = 12;

export default class Ball {
    constructor(x, y, moveX, moveY, theme) {
        this.moveX = moveX;
        this.moveY = moveY;
        this.theme = theme;
        this.size = this.theme === "classic" ? 15 : 10;
        this.x = x;
        this.y = y;

    }

    update = () => {
        this.y += this.moveY;
        this.x += this.moveX;
    }

    draw = (ctx) => {
        ctx.fillStyle = COLORS[this.theme];
      
        if (this.theme === "classic") {
            ctx.fillRect(this.x, this.y, this.size, this.size);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
        }
    
        
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

        
        if (ballRight >= paddleLeft && ballLeft <= paddleRight && ballBottom >= paddleTop && ballTop <= paddleBottom) {
            
            if (ballRight >= paddleLeft && paddle.playerIndex === 1) {
                if (this.theme === "classic") { this.x = paddleLeft - this.size; }
                this.x = paddleLeft + paddle.width + this.size;
            }
            
            else if (ballLeft <= paddleRight && paddle.playerIndex === 2) {
                if (this.theme === "classic") { this.x = paddleRight; }
                this.x = paddleRight - this.size - paddle.width;
            }
            
            
            return true;
        }
        return false;
    }
    

    bounceOnPaddles= (paddle) => {
        if (this.detectCollision(paddle)){
            this.moveX *= -1;
            this.increaseSpeed();
        }
    }
    
    bounceOnWalls = (tableHeight) => {
        let ballTop = this.theme === "classic" ? this.y : this.y - this.size;
        let ballBottom = this.y + this.size;
        if (ballTop <= 0 || ballBottom >= tableHeight){
            this.moveY *= -1;
        }
    }
    
    increaseSpeed = () => {
        if (this.moveX > MAX_SPEED || this.moveY > MAX_SPEED) return;
        this.moveX < 0 ? this.moveX -= SPEED_INCREASE_FACTOR : this.moveX += SPEED_INCREASE_FACTOR;
        this.moveY < 0 ? this.moveY -= SPEED_INCREASE_FACTOR : this.moveY += SPEED_INCREASE_FACTOR; 
    }
    
    reset = (table) => {
        this.x = table.tableWidth / 2;
        this.y = table.tableHeight / 2;
        this.moveX = 5;
        this.moveY = 5;
    }
}
