import Ball from "../../entities/Ball.js";
import Paddle from "../../entities/Paddle.js";

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
        
        this.paddle1 = new Paddle(10, this.tableHeight / 2, this.playeVelocityY, 1, "fire");
        this.paddle2 = new Paddle(this.tableWidth - 10 - this.paddleWidth, this.tableHeight / 2, this.playeVelocityY, 2, "ice");
        console.log(this.paddle1)
        this.ball = new Ball(this.tableWidth / 2, this.tableHeight / 2, 10, 1, this.theme);
        this.middleCirlceRadius = 70;
    }

    connectedCallback() {
        this.render();
        this.gameplay();
        document.addEventListener("keydown", this.movePlayers.bind(this));
        document.addEventListener("keyup", this.stopPlayers.bind(this));
    }

    movePlayers = (ev) => {
        this.paddle1.directionChange(ev.code === "KeyW" ? "up" : (ev.code === "KeyS" ? "down" : ""));
        this.paddle2.directionChange(ev.code === "ArrowUp" ? "up" : (ev.code === "ArrowDown" ? "down" : ""));
    }

    stopPlayers = (ev) => {
        this.paddle1.stop(ev);
        this.paddle2.stop(ev);
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

    gameplay() {
        this.table = this.querySelector("#table");
        this.table.height = this.tableHeight;
        this.table.width = this.tableWidth;
        this.context = this.table.getContext("2d");

        requestAnimationFrame(this.update);
    }


    update = () => {
        this.context.clearRect(0, 0, this.table.width, this.table.height);
        this.drawMiddle();
        //draw paddles
        this.paddle1.update(this.tableHeight);
        this.paddle2.update(this.tableHeight);

        // update paddle position
        this.paddle1.draw(this.context);
        this.paddle2.draw(this.context);

        this.ball.draw(this.context);
        this.ball.hitPaddle(this.paddle1);
        this.ball.hitPaddle(this.paddle2);
        // this.ball.reset();
        // // ball
        // if (this.ball.y <= 0 || (this.ball.y + this.ball.height) >= this.tableHeight){
        //     this.ball.velocityY *= -1;
        // }
        // //bounce ball from paddles
        // if (this.detectCollision(this.ball, this.paddle1)){
        //     if (this.ball.x <= this.paddle1.x + this.paddle1.width){
        //         //left side of the ball touches right side of paddle1
        //         this.ball.velocityX *= -1;
        //     }

        // }
        // else if (this.detectCollision(this.ball, this.paddle2)){
        //     if (this.ball.x + this.paddle2.width >= this.paddle2.x){
        //         //left side of the ball touches right side of paddle2
        //         this.ball.velocityX *= -1;
        //     }
        //     this.increaseSpeed();
        // }
        // //check if scores
        // this.ball.draw(this.context);
        // if (this.ball.x < 0){
        //     this.player2score++;
        //     this.querySelector("c-scoreboard").setAttribute("score2", this.player2score)
        //     this.resetGame();
        // }
        // if (this.ball.x + this.ballWidth > this.tableWidth){
        //     this.player1score++;
        //     this.querySelector("c-scoreboard").setAttribute("score1", this.player1score)
        //     this.resetGame();
        // }
        // if (this.isGameOver) {
        //     this.dispatchEvent(new CustomEvent("game-over", 
        //     { detail: 
        //         { winner: this.player1score === this.finalScore 
        //             ? this.player1 : this.player2 
        //         } 
        //     }));
        //     return;
        // }
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
