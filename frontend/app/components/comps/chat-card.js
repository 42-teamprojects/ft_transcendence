import { messageState } from "../../state/messageState.js";
import { getTimePassed, isThere, truncate } from "../../utils/utils.js";

export default class Chatcard extends HTMLElement {
	constructor() {
		super();
		this.imgAtt = this.getAttribute("img") || "null";
		this.usernameAtt = this.getAttribute("username") || "null";
		this.msgAtt = this.getAttribute("msg") || "null";
		this.timeAtt = this.getAttribute("time") || "null";
		this.idAtt = this.getAttribute("chat-id") || "null";
		this.maxNameSize = 15;
		this.isActive = false;
		this.isSeen = false;
		this.display = true;
		this.focus = false;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "active") {
			this.isActive = isThere(["true", ""], newValue, false);
			this.render();
		}
		if (name === "time") {
			this.timeAtt = newValue;
			this.render();
		}
		if (name === "msg") {
			this.msgAtt = newValue;
			this.render();
		}
	}

	static get observedAttributes() {
		return ["active", "time", "msg"];
	}

	connectedCallback() {
		this.windowLink = window.location.href;
		//check if the link end with the chat id
		this.focus = this.windowLink.endsWith(this.idAtt);
		if (this.focus) {
			messageState.markMessageAsRead(this.idAtt);
			
		}
		this.render();
	}
	
	disconnectedCallback() {
		// Nothing to do here
	}
	
	render() {
		this.innerHTML = /*html*/ `
        <a is="c-link" href="/dashboard/chat/${this.idAtt}">
		<div class="message-card ${this.isActive ? "active" : ""}" style="position: relative">
                <img class="message-card__img" src="${this.imgAtt}" alt="user">
                <div class="flex-col gap-2">
                    <div class="font-bold">${this.usernameAtt}</div>
                    ${
						this.msgAtt === "null"
							? /*html*/ `
                      <div class="skeleton skeleton-text"></div>
                      `
							: /*html*/ `
                      <div style="font-size: 14px; color: gray">${truncate(this.msgAtt, 23)}</div>
                      `
					}
                </div>
                ${
					this.timeAtt === "null"
						? /*html*/ `
                  <div class="message-card__time skeleton skeleton-micro"></div>
                  `
						: /*html*/ `
                  <div class="message-card__time">${getTimePassed(this.timeAtt)}</div>
                  `
				}
            </div>
        </a>
        `;
        if (this.timeAtt !== "null") {
            this.messageTime = this.querySelector(".message-card__time");
            setInterval(() => {
              this.messageTime.textContent = getTimePassed(this.timeAtt);
            }, 1000);
        }
	}
}
