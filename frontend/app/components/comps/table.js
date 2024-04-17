export default class Table extends HTMLElement {
    constructor() {
        super();
        this.theme = this.getAttribute("theme")
        this.player1 = this.getAttribute("player1")
        this.player2 = this.getAttribute("player2")
        this.paddle1color = this.getAttribute("paddle1")
        this.paddle2color = this.getAttribute("paddle2")
        this.finalScore = 7;
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
            <div class="h-full w-full flex-col-center">
                <c-scoreboard   class="mb-5"
                                player1="${this.player1}" 
                                player2="${this.player2}" 
                                score1="${this.player1score}"
                                score2="${this.player1score}">
                </c-scoreboard>
                <canvas id="table" class="table table-${this.theme}"></canvas>
            </div>
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
        this.context.fillStyle = paddleColor;
        this.context.fillRect(paddle.x, paddle.y + this.radius, paddle.width, paddle.height - 2 * this.radius);
        
        if (this.theme !== "classic"){
            // Draw the top semi-circle of the paddle
            this.context.beginPath();
            this.context.arc(paddle.x + paddle.width / 2, paddle.y + this.radius, this.radius, Math.PI, 2 * Math.PI);
            this.context.fill();
        
            // Draw the bottom semi-circle of the paddle
            this.context.beginPath();
            this.context.arc(paddle.x + paddle.width / 2, paddle.y + paddle.height - this.radius, this.radius, 0, Math.PI);
            this.context.fill();
        }
        else {
            this.context.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
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
            this.increaseSpeed();
        }
        //check if scores
        this.drawBall();
        if (this.ball.x < 0){
            this.player2score++;
            this.querySelector("c-scoreboard").setAttribute("score2", this.player2score)
            this.resetGame();
        }
        if (this.ball.x + this.ballWidth > this.tableWidth){
            this.player1score++;
            this.querySelector("c-scoreboard").setAttribute("score1", this.player1score)
            this.resetGame();
        }
        if (this.isGameOver) {
            this.dispatchEvent(new CustomEvent("game-over", 
            { detail: 
                { winner: this.player1score === this.finalScore 
                    ? this.player1 : this.player2 
                } 
            }));
            return;
        }
        requestAnimationFrame(this.update);
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

    detectCollision = (ball, paddle) => {
        return  ball.x + ball < paddle.x + paddle.width && // a's top left corner doesn't reach b's top right corner
                ball.x + ball.width > paddle.x && // a's top right corner doesn't reach b's top left corner
                ball.y < paddle.y + paddle.height && // a's top left corner doesn't reach b's top right corner
                ball.y + ball.height > paddle.y; // a's top right corner doesn't reach b's top left corner
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

    resetGame = () => {
        this.ball = {
            x : this.tableWidth / 2,
            y : this.tableHeight / 2,
            width : this.ballWidth,
            height : this.ballHeight,
            velocityX : [1, -1][Math.floor(Math.random()*2)] * 10,
            velocityY : [2,3,4,5,6][Math.floor(Math.random()*6)]
        }
    }

    get isGameOver() {
        return this.player1score === this.finalScore 
            || this.player2score === this.finalScore
    }

    // increase ball speed after each round
    increaseSpeed = () => {
        this.ball.velocityX *= 1.1;
        this.ball.velocityY *= 1.1;
    }
}
