import { config } from "../../config.js";
import Ball from "../../entities/Ball.js";
import Paddle from "../../entities/Paddle.js";
import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";

const player1PressedKeys = {
	KeyW: false,
	KeyS: false,
};

const player2PressedKeys = {
	ArrowUp: false,
	ArrowDown: false,
};

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default class Table extends HTMLElement {
	constructor() {
		super();
		this.canUpdate = true;
		this.handleKeyDownF = this.handleKeyDown.bind(this);
		this.handleKeyUpF = this.handleKeyUp.bind(this);

		this.match = matchState.state.match;
		if (!this.match) {
			Router.instance.navigate("/local/1v1");
			throw new Error("Match not found");
		}
		this.theme = this.match.theme;

		this.finalScore = config.finalScore;
		
		this.tableWidth = 1235;
		this.tableHeight = 740;
		this.context = null;
		
		this.paddleWidth = 18;
		this.paddleHeight = 110;
		this.paddleMove = 0;

		this.paddle1 = new Paddle(
			1,
			this.paddleMove,
			this.match.player1.paddle,
			this
		);
		this.paddle2 = new Paddle(
			2,
			this.paddleMove,
			this.match.player2.paddle,
			this
		);
		this.ball = new Ball(
			this.tableWidth / 2,
			this.tableHeight / 2,
			getRandomInt(5, 10),
			getRandomInt(5, 7),
			this.theme
		);
		this.middleCirlceRadius = 70;

		this.scene = true;
		this.counter = 3;
		this.frameCount = 0;
	}

	connectedCallback() {
		this.render();
		this.gameplay();
		document.addEventListener("keydown", this.handleKeyDownF);
		document.addEventListener("keyup", this.handleKeyUpF);
	}

	handleKeyDown = (event) => {
		if (event.code === "KeyW" || event.code === "KeyS") {
			player1PressedKeys[event.code] = true;
			this.paddle1.directionChange(
				event.code === "KeyW" ? "up" : event.code === "KeyS" ? "down" : ""
			);
		}

		if (event.code === "ArrowUp" || event.code === "ArrowDown") {
			player2PressedKeys[event.code] = true;
			this.paddle2.directionChange(
				event.code === "ArrowUp"
					? "up"
					: event.code === "ArrowDown"
						? "down"
						: ""
			);
		}
	};

	handleKeyUp = (event) => {
		if (event.code === "KeyW" || event.code === "KeyS") {
			player1PressedKeys[event.code] = false;
		}
		if (event.code === "ArrowUp" || event.code === "ArrowDown") {
			player2PressedKeys[event.code] = false;
		}
		if (Object.values(player1PressedKeys).every((value) => !value)) {
			this.paddle1.stop(event);
		}
		if (Object.values(player2PressedKeys).every((value) => !value)) {
			this.paddle2.stop(event);
		}
	};

	movePlayers = (ev) => {
		this.paddle1.directionChange(
			ev.code === "KeyW" ? "up" : ev.code === "KeyS" ? "down" : ""
		);
		this.paddle2.directionChange(
			ev.code === "ArrowUp" ? "up" : ev.code === "ArrowDown" ? "down" : ""
		);
	};

	stopPlayers = (ev) => {
		if (ev.code === "KeyW" || ev.code === "KeyS") {
			this.paddle1.stop(ev);
		}
		if (ev.code === "ArrowUp" || ev.code === "ArrowDown") {
			this.paddle2.stop(ev);
		}
	};

	disconnectedCallback() {
		this.canUpdate = false;
		document.removeEventListener("keydown", this.handleKeyDownF);
		document.removeEventListener("keyup", this.handleKeyUpF);
		this.remove()
	}

	render() {
		this.innerHTML = /*html*/ `
            <div class="vh-full w-full flex-col-center">
                <c-scoreboard class="mb-5"
                              player1="${this.match.player1.alias}" 
                              player2="${this.match.player2.alias}" 
                              score1="${this.match.score1}"
                              score2="${this.match.score2}">
                </c-scoreboard>
                <canvas id="table" class="pong-table pong-table-${this.theme}"></canvas>
            </div>
        `;
	}

	gameplay() {
		this.table = this.querySelector("#table");
		this.table.height = this.tableHeight;
		this.table.width = this.tableWidth;
		this.context = this.table.getContext("2d");
		
		if (this.canUpdate) requestAnimationFrame(this.update);
	}

	update = () => {
		if (!this.canUpdate) return;
		
		this.frameCount++;
		
		if (this.scene) {
			this.drawScene();
		}
		else
			this.drawForGame();
		
		this.ball.bounceOnPaddles(this.paddle1);
		this.ball.bounceOnPaddles(this.paddle2);
		this.ball.bounceOnWalls(this.tableHeight);

		if (this.scored()) {
			this.scene = true;
		}
		
		if (this.isGameOver) {
			this.dispatchEvent(
				new CustomEvent("game-over", {
					detail: {
						winner: this.match.score1 === this.finalScore
								? this.match.player1
								: this.match.player2,},
				})
			);
			return;
		}
		requestAnimationFrame(this.update);
	};

	draw = () => {
		this.context.clearRect(0, 0, this.table.width, this.table.height);
		this.drawMiddle();
		this.paddle1.draw(this.context);
		this.paddle2.draw(this.context);
		this.ball.draw(this.context);
	};

	drawForGame = () => {
		this.paddle1.update(this.tableHeight);
		this.paddle2.update(this.tableHeight);
		this.ball.update();
		this.draw();
	};

	drawScene = () => {
		this.draw();
		this.context.fillStyle = "black";
		this.context.globalAlpha = 0.7;
		this.context.fillRect(0, 0, this.tableWidth, this.tableHeight);
		this.context.globalAlpha = 1;
		this.context.fillStyle = "white";
		this.context.font = "30px MPlusRounded";
		this.context.fillText('Round starts in', this.tableWidth / 2 - 120, this.tableHeight / 3);
		this.context.font = "100px MPlusRounded";
		const textWidth = this.context.measureText(this.counter).width;
		this.context.fillText(this.counter, this.tableWidth / 2 - textWidth / 2, this.tableHeight / 2);

		if (this.frameCount % 60 === 0) {
			this.counter--;
		}
		if (this.counter === 0) {
			this.scene = false;
			this.counter = 3;
		}
	};

	scored = () => {
		let scored = false;
		if (this.ball.x - this.ball.size <= 0) {
			this.match.score2++;
			scored = true;
		} else if (this.ball.x + this.ball.size >= this.tableWidth) {
			this.match.score1++;
			scored = true;
		}

		if (scored) {
			this.resetGame();
			this.querySelector("c-scoreboard").setAttribute("score1", this.match.score1);
			this.querySelector("c-scoreboard").setAttribute("score2", this.match.score2);
			this.scene = true;
		}
	};

	drawMiddle = () => {
		const STROKE_WIDTH = 120;
		const STROKE_HEIGHT = 250;
		const RECT_X = 0;
		const STROKE_COLOR = "white";
		const LINE_WIDTH = 5;

		this.context.lineWidth = LINE_WIDTH;
		this.context.strokeStyle = STROKE_COLOR;

		if (this.theme !== "classic") {
			this.context.fillStyle = this.theme === "standard" ? "#56646C" : "white";
			this.context.fillRect(
				this.tableWidth / 2 - LINE_WIDTH / 2,
				0,
				LINE_WIDTH,
				this.tableHeight
			);
			if (this.theme === "football") {
				this.context.beginPath();
				this.context.arc(this.tableWidth / 2, this.tableHeight / 2, 90, 0, 2 * Math.PI, false);
				this.context.stroke();

				this.context.beginPath();
				var rectY = (this.tableHeight - STROKE_HEIGHT) / 2; 

				this.context.rect(
					RECT_X - LINE_WIDTH,
					rectY,
					STROKE_WIDTH,
					STROKE_HEIGHT
				);
				this.context.stroke();
				this.context.rect(
					this.tableWidth - STROKE_WIDTH + LINE_WIDTH,
					rectY,
					STROKE_WIDTH,
					STROKE_HEIGHT
				);
				this.context.stroke();
			}
		} else {
			this.context.setLineDash([10, 10]); 
			this.context.beginPath();
			this.context.moveTo(this.tableWidth / 2, 0);
			this.context.lineTo(this.tableWidth / 2, this.tableHeight);
			this.context.lineWidth = 10;
			this.context.stroke();
		}
	};

	resetGame = () => {
		this.ball.reset(this);
		this.paddle1.reset();
		this.paddle2.reset();
	};

	get isGameOver() {
		return (
			this.match.score1 === this.finalScore ||
			this.match.score2 === this.finalScore
		);
	}
}
