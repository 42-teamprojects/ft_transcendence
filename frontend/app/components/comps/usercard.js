import { UserStatus } from "../../entities/enums.js";
import { truncate } from "../../utils/utils.js";
export default class Usercard extends HTMLElement {
	constructor() {
		super();
		this.userId = this.getAttribute("user-id") || "null";
		this.usernameAtt = this.getAttribute("username") || "null";
		this.statusAtt = UserStatus[this.getAttribute("status")] || "null";
		this.imgAtt = this.getAttribute("img") || "null";
		this.maxNameSize = 10;
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
			<div class="dropdown-wrapper">
				<div class="usercard flex-col-center dropdown-button">
					<img src="${this.imgAtt}" alt="user" class="object-cover w-12 h-12">
					<h3 class="username white-space pt-1 cursor-pointer" ${
						this.usernameAtt.length > this.maxNameSize ? `tooltip="${this.usernameAtt}" flow="up"` : ""
					}>${truncate(this.usernameAtt, this.maxNameSize)}</h3>
					<p class="user-status ${this.statusAtt.toLowerCase()}">${this.statusAtt}</p>
				</div>
				<c-dropdown></c-dropdown>
			</div>
        `;
	}
}
