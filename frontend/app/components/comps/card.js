import { isThere } from "../../utils/utils.js";

export default class Card extends HTMLElement {
    constructor() {
        super();
        this.actionAtt = this.getAttribute('action') || 'none'
        this.titleAtt = this.getAttribute("title") || 'none'
        this.typeAtt = isThere(["primary", "secondary", "default"], this.getAttribute("type"), 'default')
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="bg-${this.typeAtt} rounded-xl flex-col-center" style="width:278px; height:189px">
            <span class="text-2xl font-medium opacity-75">${this.actionAtt}</span>
            <h1 class="text-full" >${this.titleAtt}</h1>
        </div>
        `;
    }
}