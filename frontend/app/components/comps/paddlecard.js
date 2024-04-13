import { isThere, toCapital } from "../../utils/utils.js";

export default class Paddlecard extends HTMLElement {
    constructor() {
        super();
        this.typeAtt = toCapital(isThere(["fire", "ice", "basic"], this.getAttribute("type"), "basic"))
    }


    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="paddlecard">
            <span class="mb-2">${this.typeAtt}</span>
            <c-paddle type="${this.typeAtt}"></c-paddle>
        </div>
        `;
    }
}
