export default class LocalMatch {
    static autoId = 0;
    constructor(player1, player2, winner = null, isStarted = false, isFinished = false) {
        this.id = LocalMatch.autoId++;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = winner;
        this.isStarted = isStarted;
        this.isFinished = isFinished;
        this.score1 = 0;
        this.score2 = 0;
    }

    static fromJson(json) {
        return new LocalMatch(json.id, json.player1, json.player2, json.winner, json.isStarted, json.isFinished);
    }

    toJson() {
        return {
            id: this.id,
            player1: this.player1,
            player2: this.player2,
            winner: this.winner,
            isStarted: this.isStarted,
            isFinished: this.isFinished
        };
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

    equals(match) {
        return this.id === match.id;
    }

    startMatch() {
        this.isStarted = true;
    }

    finishMatch(winner) {
        this.winner = winner;
        this.isFinished = true;
    }

    resetMatch() {
        this.winner = null;
        this.isStarted = false;
        this.isFinished = false;
    }
}