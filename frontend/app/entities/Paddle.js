export default class Paddle {
    constructor(x, y, moveY, playerIndex, speciality) {
        this.x = x;
        this.y = y;
        this.width = 18;
        this.height = 110;
        this.moveY = moveY;
        this.playerIndex = playerIndex;
        this.speciality = speciality;
        this.nextY;
    }

    colors = {
        fire: '#EC7B3C',
        ice: '#2FB3EC',
        basic: '#D9D9D9'
    }

    draw = (ctx) => {
        ctx.fillStyle = this.colors[this.speciality];
        ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);

        // if (this.theme !== "classic"){
        //     // Draw the top semi-circle of the paddle
        //     ctx.beginPath();
        //     ctx.arc(this.x + this.width / 2, this.y - this.height / 2, 9, Math.PI, 2 * Math.PI);
        //     ctx.fill();
        
        //     // Draw the bottom semi-circle of the paddle
        //     ctx.beginPath();
        //     ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 9, 0, Math.PI);
        //     ctx.fill();
        // }
        // else {
        //     ctx.fillRect(this.x, this.y, this.width, this.height);
        // }
    }

    directionChange = (direction) => {
        if (direction === "up") {
            this.moveY = -7;
        } else if (direction === "down") {
            this.moveY = 7;
        }
    }

    outOfBounds = (tableHeight) => {

        return (this.nextY - (this.height / 2) < 0 || this.nextY + (this.height / 2) > tableHeight);
    }

    update = (tableHeight) => {
        this.nextY = this.y + this.moveY;
        if (!this.outOfBounds(tableHeight)) {
            this.y += this.moveY;
        }
    }

    stop = () => {
        this.moveY = 0;
    }
}