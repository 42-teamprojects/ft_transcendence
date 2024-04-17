export default class Ball {
    constructor(x, y, moveX, moveY, theme) {
        this.x = x;
        this.y = y;
        this.moveX = moveX;
        this.moveY = moveY;
        this.theme = theme;
        this.size;
    }

    draw = (ctx) =>{
        // define this size and color depending on the theme
        this.size = this.theme === "classic" ? 15 : 10;
        ctx.fillStyle = this.theme === "football" ? "orange" : "white";

        // move this
        this.x += this.moveX;
        this.y += this.moveY;

        // squared
        if (this.theme === "classic")
            ctx.fillRect(this.x, this.y, this.size, this.size)

        // rounded
        else {
            ctx.beginPath();
            ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size, 0, Math.PI*2, false);
            ctx.fill();
            ctx.closePath();
        }
    }

    detectCollision = (paddle) => {
        return  this.x < paddle.x + paddle.width &&
                this.x + this.width > paddle.x &&
                this.y < paddle.y + paddle.height &&
                this.y + this.height > paddle.y;
    }

    bounce = () => {
        this.moveY = -this.moveY;
    }

    hitPaddle = (paddle) => {
        if (this.detectCollision(paddle)){
            this.bounce();
            // this.increaseSpeed();
        }
    }

    increaseSpeed = () => {
        this.moveX *= 1.1;
        this.moveY *= 1.1;
    }

    reset = () => {
        this.x = this.tableWidth / 2;
        this.y = this.tableHeight / 2;
        this.moveX = 0;
        this.moveY = 0;
    }
}
