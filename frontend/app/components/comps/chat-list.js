import { userState } from "../../state/userState.js";
import { chatState } from "../../state/chatState.js";
export default class Chatlist extends HTMLElement {

	constructor() {
		super();
		this.user = userState.state.user;
	}

	async connectedCallback() {
		this.render();
        // This should only run once
	}

	disconnectedCallback() {
	}

	render() {
		this.innerHTML = /*html*/ `
        <c-friends-search-modal></c-friends-search-modal>
        <div class="chat-list">
            <div class="chat-list__header">
                <h1 class="chat-list__title">Messages</h1>
                <img src="/public/assets/icons/plus.svg" alt="add" class="chat-list__add" onclick="document.querySelector('c-friends-search-modal').open()"/>
            </div>
            <div class="chat-list__search">
                <input type="text" class="input-field" placeholder="Search Users, Messages..." />
            </div>
            <div class="chat-list__content">
                <div class="chat-list__items">
                    <c-chat-list-items></c-chat-list-items>
                </div>
            </div>
        </div>
                `;
	}
}