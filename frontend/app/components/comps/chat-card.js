import { truncate } from "../../utils/utils.js";

export default class Chatcard extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "none";
        this.usernameAtt = this.getAttribute("img") || "none";
        this.msgAtt = this.getAttribute("msg") || "none";
        this.timeAtt = this.getAttribute("time") || "none";
		this.maxNameSize = 15;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="message-card">
            <img class="message-card__img" src="${this.imgAtt}" alt="user">
            <div class="flex-col gap-2">
                <div style="font-weight: bold;" >mouad</div>
                <div style="font-size: 14px; color: gray">${this.msgAtt}</div>
            </div>
            <div class="message-card__time">${this.timeAtt}</div>
        </div>
        `;
    }
}

