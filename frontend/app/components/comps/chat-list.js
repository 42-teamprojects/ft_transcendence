import Router from "../../router/router.js";
import { userService } from "../../state/userService.js";
import { chatService } from "../../state/chatService.js";
export default class Chatlist extends HTMLElement {
  constructor() {
    super();
    this.router = Router.instance;
    this.user = userService.getState().user;
    this.chats = chatService.getState().chats;
  }
  
  connectedCallback() {
      this.render();
  }

  disconnectedCallback() {}

  render() {
    const chatCards = this.chats.map((chat) => {
      return /*html*/ `        
        <c-chat-card id="${chat.id}" username="${chat.friend.username}" img="${chat.friend.avatar}" msg="${chat.lastMessage}" time="${chat.lastMessageTime}" active="${this.router.currentRoute.endsWith(chat.friend.username)}"></c-chat-card>
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
                    ${chatCards.join("")}
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
