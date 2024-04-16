export default class LocalPlayer {
    constructor(id, alias, paddle) {
        this.id = id;
        this.alias = alias;
        this.paddle = paddle;
    }

    static fromJson(json) {
        return new LocalPlayer(json.id, json.alias, json.paddle);
    }

    toJson() {
        return {
            id: this.id,
            alias: this.alias,
            paddle: this.paddle
        };
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

    equals(player) {
        return this.id === player.id;
    }

}