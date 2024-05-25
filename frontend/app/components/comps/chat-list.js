import HttpClient from "../../http/httpClient.js";
import Router from "../../router/router.js";
import ChatApiService from "../../api/chat/chatApiService.js";
import { userService } from "../../state/userService.js";
export default class Chatlist extends HTMLElement {
    constructor() {
        super();
        this.router = Router.instance;
        this.showSearchModal = false;
        this.chatApiService = new ChatApiService();
        this.chats = [];
        this.user = userService.getState().user;
        console.log(this.user);
    }
    async connectedCallback() {
        this.render();
        document.querySelector('.chat-list__add').addEventListener('click', () => {
           this.showSearchModal = !this.showSearchModal;
        });
        this.chats = await this.chatApiService.getUserChats();
        console.log(this.chats);
        this.chats.forEach(chat => {
            const chatCard = document.createElement('c-chat-card');
            chatCard.setAttribute('username', chat.username);
            chatCard.setAttribute('img', chat.img);
            chatCard.setAttribute('msg', chat.msg);
            chatCard.setAttribute('time', chat.time);
            chatCard.setAttribute('active', this.router.currentRoute.endsWith(chat.username));
            // document.querySelector('.chat-list__items').appendChild(chatCard);
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
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