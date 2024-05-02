import Ball from "../../entities/Ball.js";
import Paddle from "../../entities/Paddle.js";
// let mouse = {x: 0, y: 0};
const pressedKeys = {
    KeyW: false,
    KeyS: false,
    ArrowUp: false,
    ArrowDown: false
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export default class Table extends HTMLElement {
  constructor() {
    super();
    this.theme = this.getAttribute("theme");
    this.player1 = this.getAttribute("player1");
    this.player2 = this.getAttribute("player2");
    this.paddle1color = this.getAttribute("paddle1");
    this.paddle2color = this.getAttribute("paddle2");
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

    this.paddle1 = new Paddle(1, this.paddleMove, "fire", this);
    this.paddle2 = new Paddle(2, this.paddleMove, "ice", this);
    this.ball = new Ball(
      this.tableWidth / 2,
      this.tableHeight / 2,
      getRandomInt(1, 10),
      getRandomInt(1, 5),
      this.theme,
      this
    );
    this.middleCirlceRadius = 70;
  }

  connectedCallback() {
    this.render();
    this.gameplay();
document.addEventListener("keydown", (event) => {
    pressedKeys[event.code] = true;
    switch (event.code) {
        case "KeyW":
            this.paddle1.directionChange("up");
            break;
        case "KeyS":
            this.paddle1.directionChange("down");
            break;
        case "ArrowUp":
            this.paddle2.directionChange("up");
            break;
        case "ArrowDown":
            this.paddle2.directionChange("down");
            break;
    }
});

document.addEventListener("keyup", (event) => {
    pressedKeys[event.code] = false;
    // check if there is still a key pressed
    if (Object.values(pressedKeys).every((value) => !value)) {
        console.log("no key pressed");
        switch (event.code) {
            case "KeyW":
            case "KeyS":
                this.paddle1.speed = 0;
                break;
            case "ArrowUp":
            case "ArrowDown":
                this.paddle2.speed = 0;
                break;
        }
    }
});

    // document.addEventListener("keydown", this.movePlayers.bind(this));
    // document.addEventListener("keyup", this.stopPlayers.bind(this));
  }

  movePlayers = (ev) => {
    // setTimeout(() => {
      this.paddle1.directionChange(
        ev.code === "KeyW" ? "up" : ev.code === "KeyS" ? "down" : ""
      );
    // }, 100);
    // setTimeout(() => {
      this.paddle2.directionChange(
        ev.code === "ArrowUp" ? "up" : ev.code === "ArrowDown" ? "down" : ""
      );
    // }, 100);
  };

  stopPlayers = (ev) => {
    if (ev.code === "KeyW" || ev.code === "KeyS") {
      this.paddle1.stop(ev);
    }
    if (ev.code === "ArrowUp" || ev.code === "ArrowDown") {
      this.paddle2.stop(ev);
    }
  };

  disconnectedCallback() {}

  render() {
    this.innerHTML = /*html*/ `
            <div class="vh-full w-full flex-col-center">
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
    // this.table.addEventListener("mousemove", (ev) => {
    //     mouse.x = ev.clientX - this.table.getBoundingClientRect().left;
    //     mouse.y = ev.clientY - this.table.getBoundingClientRect().top;
    // });
    this.table.height = this.tableHeight;
    this.table.width = this.tableWidth;
    this.context = this.table.getContext("2d");

    requestAnimationFrame(this.update);
  }

  update = () => {
    // console.log(mouse)
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
    // this.scored();

    //check if scores
    if (this.isGameOver) {
      this.dispatchEvent(
        new CustomEvent("game-over", {
          detail: {
            winner:
              this.player1score === this.finalScore
                ? this.player1
                : this.player2,
          },
        })
      );
      return;
    }
    requestAnimationFrame(this.update);
  };

  scored = () => {
    if (this.ball.x - this.ball.size <= 0) {
      this.player2score++;
      this.resetGame();
    } else if (this.ball.x + this.ball.size >= this.tableWidth) {
      console.log("player 2 scored");
      this.player1score++;
      this.resetGame();
    }
    this.querySelector("c-scoreboard").setAttribute(
      "score1",
      this.player1score
    );
    this.querySelector("c-scoreboard").setAttribute(
      "score2",
      this.player2score
    );
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
        this.context.arc(
          this.tableWidth / 2,
          this.tableHeight / 2,
          90,
          0,
          2 * Math.PI,
          false
        );
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
  };

  get isGameOver() {
    return (
      this.player1score === this.finalScore ||
      this.player2score === this.finalScore
    );
  }
}
