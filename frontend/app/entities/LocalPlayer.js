export default class LocalPlayer {
    #id;
    #alias;
    #paddle;

    constructor(id, alias, paddle) {
        this.#id = id;
        this.#alias = alias;
        this.#paddle = paddle;
    }

    get id() {
        return this.#id;
    }

    get alias() {
        return this.#alias;
    }

    get name() {
        return this.#alias;
    }

    get paddle() {
        return this.#paddle;
    }

    set id(id) {
        this.#id = id;
    }

    set alias(alias) {
        this.#alias = alias;
    }

    set paddle(paddle) {
        this.#paddle = paddle;
    }

    static fromJson(json) {
        return new LocalPlayer(json.id, json.alias, json.paddle);
    }

    toJson() {
        return {
            id: this.#id,
            alias: this.#alias,
            paddle: this.#paddle
        };
    }

    toString() {
        return JSON.stringify(this.toJson());
    }

    equals(player) {
        return this.#id === player.id;
    }

}