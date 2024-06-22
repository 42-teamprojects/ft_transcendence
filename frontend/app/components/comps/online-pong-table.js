import { config } from "../../config.js";
import Ball from "../../entities/Ball.js";
import Paddle from "../../entities/Paddle.js";
import { PaddleType, TableTheme } from "../../entities/enums.js";
import { matchState } from "../../state/matchState.js";
import { userState } from "../../state/userState.js";

const FINAL_SCORE = config.finalScore; // from config file
const TABLE_WIDTH = 1235;
const TABLE_HEIGHT = 740;
const PADDLE_WIDTH = 18;
const MIDDLE_CIRCLE_RADIUS = 70;

export default class OnlinePongTable extends HTMLElement {
	constructor() {
        super();
		this.user = userState.state.user;
		this.opponent = matchState.getOpponent(matchState.state.match);
		this.theme = TableTheme[this.user.table_theme].toLowerCase();
		this.myPaddle = PaddleType[this.user.paddle_type].toLowerCase();
		this.opponentPaddle = PaddleType[this.opponent.paddle_type].toLowerCase();
		this.canUpdate = true;
        this.match_id = this.getAttribute("match_id");
        this.player1_id = this.getAttribute("player1");
        this.player2_id = this.getAttribute("player2");	

        this.match = matchState.state.match;

        this.finalScore = FINAL_SCORE;
        this.tableWidth = TABLE_WIDTH;
        this.tableHeight = TABLE_HEIGHT;
        this.context = null;
        this.paddleWidth = PADDLE_WIDTH;
        this.paddleMove = 0;
		this.score1 = 0;
		this.score2 = 0;
        this.paddle1 = new Paddle(1, this.paddleMove, this.user.id === +this.player1_id ? this.myPaddle : this.opponentPaddle, this);
        this.paddle2 = new Paddle(2, this.paddleMove, this.user.id === +this.player2_id ? this.myPaddle : this.opponentPaddle, this);
        this.ball = new Ball( this.tableWidth / 2, this.tableHeight / 2, 5, 5, this.theme);
        this.middleCirlceRadius = MIDDLE_CIRCLE_RADIUS;

        // this.scene = true;
		this.reDraw = true;
        this.counter = 3;
        this.frameCount = 0;
        this.user = userState.state.user;
        this.obj = {
            "type": "game_update",
        }
    }
	
	connectedCallback() {
		this.render();
		this.countdownModal = this.querySelector("c-countdown-modal");
		this.reDraw = false;
		this.countdownModal.open();
		setTimeout(() => {
			this.reDraw = true;
		}, 4000);

		this.unsubscribe = matchState.subscribe(() => {
			// if (matchState.state.game === null || matchState.state.game === undefined || matchState.state.match === null || matchState.state.match === undefined) {
			// 	return;
			// }
			this.matchData = matchState.state.game;
			if (this.matchData.type === "score_update") {
				this.score1 = this.matchData.player1_score;
				this.score2 = this.matchData.player2_score;
				this.querySelector("c-online-scoreboard").setAttribute("score1", this.score1);
				this.querySelector("c-online-scoreboard").setAttribute("score2", this.score2);
			}
			if (this.user.id !== +this.player1_id && this.matchData.type === "ball_update") {
				this.ball.x = this.matchData.ball_x;
				this.ball.y = this.matchData.ball_y;
			}
			if (this.matchData.type === "game_update" && this.matchData.sender !== this.user.id) {
				this.frameCount = this.user.id !== +this.player1_id ? this.matchData.frameCount : this.frameCount;
                if (this.matchData.sender === +this.player1_id) {
                    this.paddle1.y = this.matchData.y;
                } else if (this.matchData.sender === +this.player2_id) {
                    this.paddle2.y = this.matchData.y;
                }
            }
		});
		this.gameplay();
		document.addEventListener("keydown", this.handleKeyDown);
		document.addEventListener("keyup", this.handleKeyUp);
		this.addEventListener("scored", () => {
			if (!this.isGameOver) {
				this.reDraw = false;
					this.countdownModal.open();
				setTimeout(() => {
					this.reDraw = true;
				}, 4000);
			}
		})
	}

	handleKey = (event, action) => {
        if (event.code === "KeyW" || event.code === "KeyS") {
            const direction = event.code === "KeyW" ? "up" : "down";
            const paddle = this.user.id === +this.player1_id ? this.paddle1 : this.paddle2;
            action(paddle, direction, event);
        }
    };

    handleKeyDown = (event) => {
        this.handleKey(event, (paddle, direction) => paddle.directionChange(direction));
    };

    handleKeyUp = (event) => {
        this.handleKey(event, (paddle, _, event) => paddle.stop(event));
    };

	movePlayers = () => {
		const direction = ev.code === "KeyW" ? "up" : ev.code === "KeyS" ? "down" : "";

		if (this.user.id === +this.player1_id)
			this.paddle1.directionChange(direction);
		else if (this.user.id === +this.player2_id)
			this.paddle2.directionChange(direction);
	};

	stopPlayers = (ev) => {
		if (ev.code === "KeyW" || ev.code === "KeyS") {
			if (this.user.id === +this.player1_id)
				this.paddle1.stop(ev);
		    else
				this.paddle2.stop(ev);
		}
	};

	disconnectedCallback() {
		this.unsubscribe();
		this.canUpdate = false;
		matchState.closeMatchConnection();
		matchState.reset();
		document.removeEventListener("keydown", this.handleKeyDown);
		document.removeEventListener("keyup", this.handleKeyUp);
		this.remove()
	}

	gameplay() {	
		this.table = this.querySelector("#table");
		this.table.height = this.tableHeight;
		this.table.width = this.tableWidth;
		this.context = this.table.getContext("2d");
		if (this.canUpdate)
			requestAnimationFrame(this.update);
	}

	update = () => {
		if (!this.canUpdate)	
			return ;
		const userId = this.user.id;
		this.updateObject(userId);
		this.sendGameUpdates(userId);
		if (this.user.id === +this.player1_id) {
			this.updateFrameCount();
		}
		this.updateScene();
		this.checkBounce();
		this.scored();
		this.checkGameOver();
		requestAnimationFrame(this.update);
	};
	
	updateObject = (userId) => {
		this.obj['y'] = this.obj['sender'] === +this.player1_id ? this.paddle1.y : this.paddle2.y;
		this.obj['sender'] = userId;
		this.obj['frameCount'] = this.frameCount;
	};
	
	sendGameUpdates = (userId) => {
		if (userId === +this.player1_id) {
			let balldata = {
				"type" : "ball_update",
				"ball_x" :  this.ball.x,
				"ball_y" : this.ball.y,
			}
			matchState.sendGameUpdate(balldata);
		}
		matchState.sendGameUpdate(this.obj);
	};
	
	updateFrameCount = () => {
		this.frameCount++;
	};
	
	updateScene = () => {
		this.reDraw && matchState.is_ready && this.drawForGame();
	};
	
	checkBounce = () => {
		this.ball.bounceOnPaddles(this.paddle1);
		this.ball.bounceOnPaddles(this.paddle2);
		this.ball.bounceOnWalls(this.tableHeight);
	};
	
	// checkScore = () => {
	// 	if (this.scored()) {
	// 		this.scene = true;
	// 	}
	// };
	
	checkGameOver = () => {
		if (this.isGameOver) {
			document.querySelector('c-countdown-modal')?.remove();
			if (!this.matchData.winner_id || this.matchData.winner_id === "null") {
				this.matchData.winner_id = this.score1 >= FINAL_SCORE ? +this.player1_id : +this.player2_id;
			}
			this.dispatchEvent(
				new CustomEvent("game-over", {
					detail: {
						winner: this.matchData.winner_id,},
				})
			);
			this.canUpdate = false;
			return true;
		}
		return false;
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
        // modal.setAttribute('player', +userState.state.user.id === +winner ? 'You' : name);
        // this.countdownModal.open();
		// setTimeout(() => {
		// 	this.countdownModal.hide();
		// 	this.countdownModal.countdown = 3;
		// }, 4000);
			
		// this.draw();
		// this.context.fillStyle = "black";
		// this.context.globalAlpha = 0.7;
		// this.context.fillRect(0, 0, this.tableWidth, this.tableHeight);
		// this.context.globalAlpha = 1;
		// this.context.fillStyle = "white";
		// this.context.font = "30px MPlusRounded";
		// this.context.fillText('Round starts in', this.tableWidth / 2 - 120, this.tableHeight / 3);
		// this.context.font = "100px MPlusRounded";
		// const textWidth = this.context.measureText(this.counter).width;
		// this.context.fillText(this.counter, this.tableWidth / 2 - textWidth / 2, this.tableHeight / 2);
		// if (this.frameCount % 55 === 0) {
		// 	this.counter--;
		// }
		// if (this.counter === 0) {
		// 	this.scene = false;
		// 	this.counter = 3;
		// }
	};

	scored = () => {
		let scored = false;
		if (this.ball.x - this.ball.size <= 0) {
			if (this.user.id === +this.player2_id)
				matchState.sendGameUpdate({ type: "increase_score", sender_id: +this.player2_id });
			scored = true;
		} else if (this.ball.x + this.ball.size >= this.tableWidth) {
			if (this.user.id === +this.player1_id)
				matchState.sendGameUpdate({ type: "increase_score", sender_id: +this.player_id });
			scored = true;
		}

		if (scored) {
			this.resetGame();
			if (!this.isGameOver) {
				this.dispatchEvent(new CustomEvent("scored"));
			}
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
				var rectY = (this.tableHeight - STROKE_HEIGHT) / 2; // This positions the rectangle vertically in the middle

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
			this.context.setLineDash([10, 10]); // Set the dash style as [dashLength, spaceLength]
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
			this.score1 === this.finalScore ||
			this.score2 === this.finalScore
		);
	}
	render() {
		this.innerHTML = /*html*/ `
		<div class="vh-full w-full flex-col-center">
			<c-countdown-modal></c-countdown-modal>
			<c-online-scoreboard class="mb-5"></c-online-scoreboard>
			<canvas id="table" class="pong-table pong-table-${this.theme}"></canvas>
		</div>
		`;
	}
}

