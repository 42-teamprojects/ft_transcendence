import { truncate } from "../../utils/utils.js";
export default class Usercard extends HTMLElement {
	constructor() {
		super();
		this.usernameAtt = this.getAttribute("username") || "none";
		this.statusAtt = this.getAttribute("status") || "none";
		this.imgAtt = this.getAttribute("img") || "none";
		this.maxNameSize = 10;
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
            <div class="usercard flex-col-center">
                <img src="${this.imgAtt}" alt="user">
                <p class="username white-space pt-1 cursor-pointer" ${
					this.usernameAtt.length > this.maxNameSize ? `tooltip="${this.usernameAtt}" flow="up"` : ""
				}>${truncate(this.usernameAtt, this.maxNameSize)}</p>
                <p class="user-status ${this.statusAtt}">${this.statusAtt}</p>
            </div>
        `;
	}
}
