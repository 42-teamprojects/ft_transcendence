export default class LocalMatch {
    #id;
    #player1;
    #player2;
    #winner;
    #isStarted;
    #isFinished;

    constructor(id, player1, player2, winner = null, isStarted = false, isFinished = false) {
        this.#id = id;
        this.#player1 = player1;
        this.#player2 = player2;
        this.#winner = winner;
        this.#isStarted = isStarted;
        this.#isFinished = isFinished;
    }

    get id() {
        return this.#id;
    }

    get player1() {
        return this.#player1;
    }

    get player2() {
        return this.#player2;
    }

    get winner() {
        return this.#winner;
    }

    get isStarted() {
        return this.#isStarted;
    }

    get isFinished() {
        return this.#isFinished;
    }

    set id(id) {
        this.#id = id;
    }

    set player1(player1) {
        this.#player1 = player1;
    }

    set player2(player2) {
        this.#player2 = player2;
    }

    set winner(winner) {
        this.#winner = winner;
    }

    set isStarted(isStarted) {
        this.#isStarted = isStarted;
    }

    set isFinished(isFinished) {
        this.#isFinished = isFinished;
    }

    static fromJson(json) {
        return new LocalMatch(json.id, json.player1, json.player2, json.winner, json.isStarted, json.isFinished);
    }

    toJson() {
        return {
            id: this.#id,
            player1: this.#player1,
            player2: this.#player2,
            winner: this.#winner,
            isStarted: this.#isStarted,
            isFinished: this.#isFinished
        };
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

    equals(match) {
        return this.#id === match.id;
    }

    startMatch() {
        this.#isStarted = true;
    }

    finishMatch(winner) {
        this.#winner = winner;
        this.#isFinished = true;
    }

    resetMatch() {
        this.#winner = null;
        this.#isStarted = false;
        this.#isFinished = false;
    }
}