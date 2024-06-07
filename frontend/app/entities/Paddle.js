const semiCircleDiameter = 9 * 2; // Diameter is twice the radius

export default class Paddle {
    constructor(playerIndex, speed, speciality, table) {
        this.playerIndex = playerIndex;
        this.width = 18;
        this.height = 110;
        this.x = this.playerIndex === 1 ? 10 : table.tableWidth - 10 - this.width;
        this.y = table.tableHeight / 2 - this.height / 2;
        this.speed = speed;
        this.speciality = speciality;
        this.nextY;
        this.table = table;
    }

    colors = {
        fire: '#EC7B3C',
        ice: '#2FB3EC',
        basic: '#D9D9D9'
    }

    draw = (ctx) => {
        ctx.fillStyle = this.colors[this.speciality];
    
        if (this.table.theme !== "classic"){
            // Draw the rectangle for the paddle
            ctx.fillRect(this.x, this.y + semiCircleDiameter / 2, this.width, this.height - semiCircleDiameter);
    
            // Draw the top semi-circle of the paddle
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + semiCircleDiameter / 2, 9, Math.PI, 2 * Math.PI);
            ctx.fill();
        
            // Draw the bottom semi-circle of the paddle
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height - (semiCircleDiameter / 2), 9, 0, Math.PI);
            ctx.fill();
        }
        else {
            // Draw the rectangle for the paddle
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    

    directionChange = (direction) => {
        if (direction === "up") {
            this.speed = -7;
        } else if (direction === "down") {
            this.speed = 7  ;
        }
    }

    outOfBounds = (tableHeight) => {
        return (this.nextY + semiCircleDiameter / 3 < 0 || this.nextY + this.height > tableHeight);
    }

    update = (tableHeight) => {
        this.nextY = this.y + this.speed;
        if (!this.outOfBounds(tableHeight)) {
            this.y += this.speed;
        }
    }

    reset = () => {
        this.y = this.table.tableHeight / 2 - this.height / 2;
    }

    stop = () => {
        this.speed = 0;
    }
}