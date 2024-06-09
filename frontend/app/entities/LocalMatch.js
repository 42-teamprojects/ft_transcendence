export default class LocalMatch {
    static autoId = 0;
    constructor(player1, player2) {
        this.id = LocalMatch.autoId++;
        this.player1 = player1;
        this.player2 = player2;
        this.winner = null;
        this.isStarted = false;
        this.isFinished = false;
        this.score1 = 0;
        this.score2 = 0;
        this.theme = "";
    }

    static fromJson(json) {
        return new LocalMatch(json.id, json.player1, json.player2, json.winner, json.isStarted, json.isFinished);
    }

    setTheme(theme) {
        this.theme = theme;
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

    resetScore() {
        this.score1 = 0;
        this.score2 = 0;
    }

    resetMatch() {
        this.resetScore();
        this.winner = null;
        this.isStarted = false;
        this.isFinished = false;
    }
}