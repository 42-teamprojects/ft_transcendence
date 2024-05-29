import { isThere } from "../../utils/utils.js";

export default class Card extends HTMLElement {
    constructor() {
        super();
        this.actionAtt = this.getAttribute('action') || 'null'
        this.titleAtt = this.getAttribute("title") || 'null'
        this.typeAtt = isThere(["primary", "secondary", "default"], this.getAttribute("type"), 'default')
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="bg-${this.typeAtt} rounded-xl flex-col-center gap-3 hover option-card">
            <span class="text-2xl font-medium opacity-50">${this.actionAtt}</span>
            <h1 class="text-3xl" >${this.titleAtt}</h1>
        </div>
        `;
    }
}