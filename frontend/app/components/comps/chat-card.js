import { isThere, truncate } from "../../utils/utils.js";

export default class Chatcard extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "none";
        this.usernameAtt = this.getAttribute("username") || "none";
        this.msgAtt = this.getAttribute("msg") || "none";
        this.timeAtt = this.getAttribute("time") || "none";
		this.maxNameSize = 15;
        this.isActive = false;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "active") {
          this.isActive = isThere(["true", ""], newValue, false);
          this.render();
        }
      }
  
      static get observedAttributes() {
        return ["active"];
      }
    

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <a is="c-link" href="/dashboard/chat/${this.usernameAtt}">
            <div class="message-card ${this.isActive ? 'active' : ''}">
                <img class="message-card__img" src="${this.imgAtt}" alt="user">
                <div class="flex-col gap-2">
                    <div style="font-weight: bold;" >${this.usernameAtt}</div>
                    <div style="font-size: 14px; color: gray">${this.msgAtt}</div>
                </div>
                <div class="message-card__time">${this.timeAtt}</div>
            </div>
        </a>
        `;
    }
}

