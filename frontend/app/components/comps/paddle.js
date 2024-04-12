import { isThere } from "../../utils/utils.js";

export default class Paddle extends HTMLElement {
    constructor() {
        super();
        this.typeAtt = isThere(["fire", "ice", "basic"], this.getAttribute("type"), "basic")
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="paddle-${this.typeAtt}"></div>
        `;
    }
}
