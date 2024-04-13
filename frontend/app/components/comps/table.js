export default class Table extends HTMLElement {
    constructor() {
        super();
        //table
        this.table = null;
        this.tableWidth = 1235;
        this.tableHeight = 740;
        this.context = null;
        // paddle
        this.paddleWidth = 18;
        this.paddleHeight = 110;
        this.radious = 9;
        this.playeVelocityY = 0;
        //score
        this.player1score = 0;
        this.player2score = 0;

        this.paddle1 = {
            x : 15,
            y : this.tableHeight/2 - this.paddleHeight/2,
            width : this.paddleWidth,
            height : this.paddleHeight,
            velocityY : this.playeVelocityY
        }
        this.paddle2 = {
            x : this.tableWidth - this.paddleWidth - 15,
            y : this.tableHeight/2 - this.paddleHeight/2,
            width : this.paddleWidth,
            height : this.paddleHeight,
            velocityY : this.playeVelocityY
        }

        this.ballWidth = 15;
        this.ballHeight = 15;
        this.ballRadious = 7;
        this.ball = {
            x : this.tableWidth /2,
            y : this.tableHeight /2,
            width : this.ballWidth,
            height : this.ballHeight,
            velocityX : 7,
            velocityY : 4,
        }
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center relative">
            <canvas id="table" class="table"></canvas>
        </div>
        `;
        this.gameplay();
    }

    getPaddleColor = (paddle1Type) => {
        let color;
        switch(paddle1Type) {
            case 'fire':
                color = '#EC7B3C';
                break;
            case 'ice':
                color = '#2FB3EC';
                break;
            case 'basic':
                color = '#D9D9D9';
                break;
            default:
                color = '#D9D9D9';
        }
        return color;
    }

    gameplay() {
        this.table = this.querySelector("#table");
        this.table.height = this.tableHeight;
        this.table.width = this.tableWidth;
        this.context = this.table.getContext("2d");

        //draw paddle1

        let paddle1Color = this.getPaddleColor("fire");

        this.context.fillStyle = paddle1Color;
        this.context.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
        
        //draw paddle2
        
        let paddle2Color = this.getPaddleColor("basic");
        
        this.context.fillStyle = paddle2Color;
        this.context.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle1.height);
        
        requestAnimationFrame(this.update);
        document.addEventListener("keydown", this.movePlayer);
        document.addEventListener("keyup", this.stopPlayer);
    }
    
    update = () => {
        requestAnimationFrame(this.update);
        this.context.clearRect(0, 0, this.table.width, this.table.height);
        //player 1
        let paddle1Color = this.getPaddleColor("fire");
        let paddle1NextY = this.paddle1.y + this.paddle1.velocityY;
        if (!this.outOfBounds(paddle1NextY)){
            this.paddle1.y = paddle1NextY;
        }
        this.context.fillStyle = paddle1Color;
        this.context.fillRect(this.paddle1.x, this.paddle1.y, this.paddle1.width, this.paddle1.height);
        
        //player2
        let paddle2Color = this.getPaddleColor("basic");
        let paddle2NextY = this.paddle2.y + this.paddle2.velocityY;
        if (!this.outOfBounds(paddle2NextY)){
            this.paddle2.y = paddle2NextY;
        }
        this.context.fillStyle = paddle2Color;
        this.context.fillRect(this.paddle2.x, this.paddle2.y, this.paddle2.width, this.paddle1.height);

        // ball
        this.context.fillStyle = "white";
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;
        // this.context.beginPath();
        // this.context.arc(this.ball.x, this.ball.y, this.ballRadious, 0, Math.PI*2, false);
        // this.context.fill();
        // this.context.closePath();
        this.context.fillRect(this.ball.x, this.ball.y, this.ballWidth, this.ballHeight)
        if (this.ball.y <= 0 || (this.ball.y + this.ball.height) >= this.tableHeight){
            this.ball.velocityY *= -1;
        }
        //bounce ball from paddles
        if (this.detectCollision(this.ball, this.paddle1)){
            if (this.ball.x <= this.paddle1.x + this.paddle1.width){
                //left side of the ball touches right side of paddle1
                this.ball.velocityX *= -1;
            }
        }
        else if (this.detectCollision(this.ball, this.paddle2)){
            if (this.ball.x + this.paddle2.width >= this.paddle2.x){
                //left side of the ball touches right side of paddle2
                this.ball.velocityX *= -1;
            }
        }
        //check if scores
        if (this.ball.x < 0){
            this.player2score++;
            this.resetGame(7);
        }
        if (this.ball.x + this.ballWidth > this.tableWidth){
            this.player1score++;
            this.resetGame(-7);
        }
        this.context.fillStyle = "#323A41";
        this.context.font = "130px MPlusRounded";
        
        let textWidth1 = this.context.measureText(this.player1score).width;
        let textWidth2 = this.context.measureText(this.player2score).width;
        
        // Draw scores
        this.context.fillText(this.player1score, this.tableWidth/3 - textWidth1 - 10, 154);
        this.context.fillText(this.player2score, this.tableWidth/1.5 + 10, 154);
        
        // Change font size for player names
        this.context.font = "35px MPlusRounded"; // Adjust the size as needed
        
        // Draw player names above scores
        this.context.fillText("Player 1", this.tableWidth/3 - textWidth1 - 10, 40); // Replace "Player 1" with the actual player name
        this.context.fillText("Player 2", this.tableWidth/1.5 + 10, 40); // Replace "Player 2" with the actual player name
        
        this.context.fillStyle = "#56646C";
        this.context.fillRect(this.tableWidth / 2, 0, 5, this.tableHeight)
        }

    outOfBounds = (yPosition) => {
        return (yPosition < 0 || yPosition + this.paddleHeight > this.tableHeight);
    }
    detectCollision = (a, b) => {
        return  a.x < b.x + b.width && // a's top left corner doesn't reach b's top right corner
                a.x + a.width > b.x && // a's top right corner doesn't reach b's top left corner
                a.y < b.y + b.height && // a's top left corner doesn't reach b's top right corner
                a.y + a.height > b.y; // a's top right corner doesn't reach b's top left corner
    }

    movePlayer = (ev) => {
        // move player 1
        let velocity = 7
        if (ev.code === "KeyW"){
            this.paddle1.velocityY = -velocity;
        } else if (ev.code === "KeyS"){
            this.paddle1.velocityY = velocity;
        }
        
        // move player 2
        if (ev.code === "ArrowUp"){
            this.paddle2.velocityY = -velocity;
        } else if (ev.code === "ArrowDown"){
            this.paddle2.velocityY = velocity;
        }
    }
    stopPlayer = (ev) => {
        if (ev.code === "KeyW" || ev.code === "KeyS"){
            this.paddle1.velocityY = 0;
        }
        if (ev.code === "ArrowUp" || ev.code === "ArrowDown"){
            this.paddle2.velocityY = 0;
        }
    }
    resetGame = (direction) => {
        this.ball = {
            x : this.tableWidth /2,
            y : this.tableHeight /2,
            width : this.ballWidth,
            height : this.ballHeight,
            velocityX : direction,
            velocityY : 4,
        }
    }
}


// this.context.beginPath();
// this.context.rect(this.paddle1.x, this.paddle1.y + this.radious, this.paddle1.width, this.paddle1.height - 2 * this.radious);
// this.context.fillStyle = paddle1Color;
// this.context.fill();

// // Draw the top semi-circle of the paddle
// this.context.beginPath();
// this.context.arc(this.paddle1.x + this.paddle1.width / 2, this.paddle1.y + this.radious, this.radious, Math.PI, 2 * Math.PI);
// this.context.fillStyle = paddle1Color;
// this.context.fill();

// // Draw the bottom semi-circle of the paddle
// this.context.beginPath();
// this.context.arc(this.paddle1.x + this.paddle1.width / 2, this.paddle1.y + this.paddle1.height - this.radious, this.radious, 0, Math.PI);
// this.context.fillStyle = paddle1Color;
// this.context.fill();
