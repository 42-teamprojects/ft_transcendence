export default class Ball {
    constructor(x, y, moveX, moveY, theme, table) {
        this.x = x;
        this.y = y;
        this.moveX = moveX;
        this.moveY = moveY;
        this.theme = theme;
        this.size;
        this.pas = [];
        this.table = table;
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

    detectCollision = (paddle) => {
        return  this.x < paddle.x + paddle.width &&
                this.x + this.size > paddle.x &&
                this.y < paddle.y + paddle.height  / 2&&
                this.y + this.size > paddle.y   - paddle.height / 2;
    }

    bounceOnPaddles= (paddle) => {
        if (!this.detectCollision(paddle)){
            this.moveX = -this.moveX;
            // this.moveX = 0;
            // this.moveY = 0;
        }
    }

    bounceOnWalls = (tableHeight) => {
        if (this.y <= 0 || this.y + this.size >= tableHeight){
            this.moveY *= -1;
        }
    }

    increaseSpeed = () => {
        this.moveX *= 1.1;
        this.moveY *= 1.1;
    }

    reset = (table) => {
        this.x = table.tableWidth / 2;
        this.y = table.tableHeight / 2;
        this.moveX = this.moveX;
        this.moveY = this.moveY;
        this.size = this.size;
        this.theme = this.theme;
    }
}
