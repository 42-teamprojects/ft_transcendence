export default class Table extends HTMLElement {
    constructor() {
        super();
        this.theme = this.getAttribute("theme")
        this.player1 = this.getAttribute("player1")
        this.player2 = this.getAttribute("player2")
        this.paddle1color = this.getAttribute("paddle1")
        this.paddle2color = this.getAttribute("paddle2")
        //table
        this.table = null;
        this.tableWidth = 1235;
        this.tableHeight = 740;
        this.context = null;
        // paddle
        this.paddleWidth = 18;
        this.paddleHeight = 110;
        this.radius = 9;
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
        this.ballRadius = 10;
        this.ball = {
            x : this.tableWidth / 2 - this.ballHeight/3,
            y : this.tableHeight / 2 - this.ballHeight/3,
            width : this.ballWidth,
            height : this.ballHeight,
            velocityX : 10,
            velocityY : 1,
        }
        this.middleCirlceRadius = 70;
    }

    connectedCallback() {
        this.render();
        this.gameplay();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <canvas id="table" class="table table-${this.theme}"></canvas>
        `;
    }

    getPaddleColor = (speciality) => {
        let color;
        switch(speciality) {
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

        requestAnimationFrame(this.update);
        document.addEventListener("keydown", this.movePlayer);
        document.addEventListener("keyup", this.stopPlayer);
    }

    drawPaddle = (speciality, player) => {

        let paddle = player === 1 ? this.paddle1 : this.paddle2;
        let paddleColor = this.getPaddleColor(speciality);
        this.context.beginPath();
        this.context.rect(paddle.x, paddle.y + this.radius, paddle.width, paddle.height - 2 * this.radius);
        this.context.fillStyle = paddleColor;
        this.context.fill();
        
        if (this.theme !== "classic"){
            // Draw the top semi-circle of the paddle
            this.context.beginPath();
            this.context.arc(paddle.x + paddle.width / 2, paddle.y + this.radius, this.radius, Math.PI, 2 * Math.PI);
            this.context.fillStyle = paddleColor;
            this.context.fill();
        
            // Draw the bottom semi-circle of the paddle
            this.context.beginPath();
            this.context.arc(paddle.x + paddle.width / 2, paddle.y + paddle.height - this.radius, this.radius, 0, Math.PI);
            this.context.fillStyle = paddleColor;
            this.context.fill();
        }
    }

    drawBall = () => {
        this.context.fillStyle = this.theme === "football" ? "orange" : "white";
        this.ball.x += this.ball.velocityX;
        this.ball.y += this.ball.velocityY;

        // squared
        if (this.theme === "classic")
            this.context.fillRect(this.ball.x, this.ball.y, this.ballWidth, this.ballHeight)

        // rounded
        else {
        this.context.beginPath();
        this.context.arc(this.ball.x + this.ballWidth / 2, this.ball.y + this.ballWidth / 2, this.ballRadius, 0, Math.PI*2, false);
        this.context.fill();
        this.context.closePath();
        }
    }
    
    update = () => {
        requestAnimationFrame(this.update);
        this.context.clearRect(0, 0, this.table.width, this.table.height);
        this.drawMiddle();
        //player 1
        let paddle1NextY = this.paddle1.y + this.paddle1.velocityY;
        if (!this.outOfBounds(paddle1NextY)){
            this.paddle1.y = paddle1NextY;
        }
        this.drawPaddle(this.paddle1color, 1);
        
        //player2
        let paddle2NextY = this.paddle2.y + this.paddle2.velocityY;
        if (!this.outOfBounds(paddle2NextY)){
            this.paddle2.y = paddle2NextY;
        }
        this.drawPaddle(this.paddle2color, 2)
        
        // ball
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
            this.resetGame(this.ball.velocityX);
        }
        if (this.ball.x + this.ballWidth > this.tableWidth){
            this.player1score++;
            this.resetGame(-this.ball.velocityX);
        }
        this.context.fillStyle = "#323A41";
        this.context.font = "130px MPlusRounded";
        
        let textWidth1 = this.context.measureText(this.player1score).width;
        
        // Draw scores
        this.context.fillText(this.player1score, this.tableWidth/3 - textWidth1 - 10, 154);
        this.context.fillText(this.player2score, this.tableWidth/1.5 + 10, 154);
        
        // Change font size for player names
        this.context.font = "35px MPlusRounded"; // Adjust the size as needed
        
        // Draw player names above scores
        this.context.fillText(this.player1, this.tableWidth/3 - textWidth1 - 40, 40); // Replace "Player 1" with the actual player name
        this.context.fillText(this.player2, this.tableWidth/1.5 - 10, 40); // Replace "Player 2" with the actual player name
        this.drawBall();
    }
    
    drawMiddle = () => {
        if (this.theme !== "classic"){
            this.context.fillStyle = this.theme === "standard" ? "#56646C" : "white";
            this.context.fillRect(this.tableWidth / 2, 0, 5, this.tableHeight)
            if (this.theme === "football") {
                this.context.beginPath();
                this.context.arc(this.tableWidth / 2, this.tableHeight / 2, 90, 0, 2 * Math.PI, false);
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'white'; // Change this to the desired border color
                this.context.stroke();

                this.context.beginPath();
                var rectWidth = 120; // Change this to the desired width
                var rectHeight = 250; // Change this to the desired height
                var rectX = 0; // This positions the rectangle on the left side of the canvas
                var rectY = (this.tableHeight - rectHeight) / 2; // This positions the rectangle vertically in the middle

                this.context.rect(rectX - 5, rectY, rectWidth, rectHeight);
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'white'; // Change this to the desired border color
                this.context.stroke();
                this.context.rect(this.tableWidth - rectWidth + 5, rectY, rectWidth, rectHeight);
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'white'; // Change this to the desired border color
                this.context.stroke();
            }
        }
        else {
            this.context.setLineDash([10, 10]); // Set the dash style as [dashLength, spaceLength]
            this.context.beginPath();
            this.context.moveTo(this.tableWidth / 2, 0);
            this.context.lineTo(this.tableWidth / 2, this.tableHeight);
            this.context.lineWidth = 10;
            this.context.strokeStyle = "white";
            this.context.stroke();
        }
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
            velocityY : this.ball.velocityY,
        }
    }
}
