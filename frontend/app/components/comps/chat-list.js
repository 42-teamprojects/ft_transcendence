import Router from "../../router/router.js";
import { userState } from "../../state/userState.js";
import { chatState } from "../../state/chatState.js";
export default class Chatlist extends HTMLElement {
	constructor() {
		super();
		this.router = Router.instance;
		this.user = userState.getState().user;
	}
  
	async connectedCallback() {
    this.render();
		this.unsubscribe = chatState.subscribe(() => {
      this.render();
		});

    await chatState.getChats();
	}

	disconnectedCallback() {
		this.unsubscribe();
	}

	render() {
		const chatCards = chatState.getState().chats.map((chat) => {
			return /*html*/ `        
        <c-chat-card chat-id="${chat.id}" username="${chat.friend.username}" img="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef" msg="${
				chat.last_message
			}" time="${chat.last_message_time}" active="${this.router.currentRouteEndsWith(
				chat.id.toString()
			)}"></c-chat-card>
        `;
		});

		this.innerHTML = /*html*/ `
        <c-chat-search-modal></c-chat-search-modal>
        <div class="chat-list">
            <div class="chat-list__header">
                <h1 class="chat-list__title">Messages</h1>
                <img src="/public/assets/icons/plus.svg" alt="add" class="chat-list__add" onclick="document.querySelector('c-chat-search-modal').open()"/>
            </div>
            <div class="chat-list__search">
                <input type="text" class="input-field" placeholder="Search Users, Messages..." />
            </div>
            <div class="chat-list__content">
                <div class="chat-list__items">
                    ${chatState.getState().loading ? /*html*/`
                      <c-loading-chat-card></c-loading-chat-card>
                      <c-loading-chat-card></c-loading-chat-card>
                      <c-loading-chat-card></c-loading-chat-card>
                      <c-loading-chat-card></c-loading-chat-card>
                    ` : chatCards.join("")}
                </div>
            </div>
        </div>
                `;
	}
}

// <c-chat-card username="msodor" img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad" msg="hello" time="1h" active="${this.router.currentRoute.endsWith('msodor')}"></c-chat-card>
// <c-chat-card username="hassan" img="https://api.dicebear.com/8.x/thumbs/svg?seed=hassan" msg="wa fin a sat" time="50m" active="${this.router.currentRoute.endsWith('hassan')}"></c-chat-card>
// <c-chat-card username="hamza" img="https://api.dicebear.com/8.x/thumbs/svg?seed=hamza" msg="dkhol le3bo" time="1m" active="${this.router.currentRoute.endsWith('hamza')}"></c-chat-card>
// <c-chat-card username="youssef" img="https://api.dicebear.com/8.x/thumbs/svg?seed=yousef" msg="saredli saredli" time="13m" active="${this.router.currentRoute.endsWith('youssef')}"></c-chat-card>
