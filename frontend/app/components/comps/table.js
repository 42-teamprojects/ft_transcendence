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
        this.tableWidth = 1235;
        this.tableHeight = 740;
        this.context = null;
        // paddle
        this.paddleWidth = 18;
        this.paddleHeight = 110;
        this.paddleMove = 0;
        //score
        this.player1score = 0;
        this.player2score = 0;
        
        this.paddle1 = new Paddle(1, this.paddleMove,"fire", this);
        this.paddle2 = new Paddle(2, this.paddleMove,"ice", this);
        this.ball = new Ball(this.tableWidth / 2 , this.tableHeight / 2, 10, 1, this.theme, this);
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
        // this.context.fillStyle = 'rgba(0, 0, 0, 0.25)';
        // this.context.fillRect(0, 0, this.tableWidth, this.tableHeight);
        this.context.clearRect(0, 0, this.table.width, this.table.height);
        this.drawMiddle();
        //draw paddles
        this.paddle1.update(this.tableHeight);
        this.paddle2.update(this.tableHeight);

        // update paddle position
        this.paddle1.draw(this.context);
        this.paddle2.draw(this.context);

        this.ball.draw(this.context);
        this.ball.bounceOnPaddles(this.paddle1);
        this.ball.bounceOnPaddles(this.paddle2);
        this.ball.bounceOnWalls(this.tableHeight);
        this.scored();

        //check if scores
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

    scored = () => {
        if (this.ball.x < 0){
            this.player2score++;
            this.resetGame();
        }
        else if (this.ball.x + this.ball.size > this.tableWidth) {
            console.log("player 2 scored")
            this.player1score++;
            this.resetGame();
        }
        this.querySelector("c-scoreboard").setAttribute("score1", this.player1score)
        this.querySelector("c-scoreboard").setAttribute("score2", this.player2score)
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
                var strokeWidth = 120; // Change this to the desired width
                var strokeHeight = 250; // Change this to the desired height
                var rectX = 0; // This positions the rectangle on the left side of the canvas
                var rectY = (this.tableHeight - strokeHeight) / 2; // This positions the rectangle vertically in the middle

                this.context.rect(rectX - 5, rectY, strokeWidth, strokeHeight);
                this.context.lineWidth = 5;
                this.context.strokeStyle = 'white'; // Change this to the desired border color
                this.context.stroke();
                this.context.rect(this.tableWidth - strokeWidth + 5, rectY, strokeWidth, strokeHeight);
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
        this.ball.reset(this);
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
