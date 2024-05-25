import { chatService } from "../../state/chatService.js";
import ChatApiService from "../../api/chat/chatApiService.js";
import { userService } from "../../state/userService.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversationbody extends HTMLElement {
  constructor() {
    super();
    this.chatApiService = new ChatApiService();
    this.user = userService.getState().user;
  }

  async getChatMessages() {
    let chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/);
      if (!chatId) {
        throw new Error("Chat id not found");
      }
      await chatService.getChatMessages(chatId);
  }

  async connectedCallback() {
    try {
        await this.getChatMessages();
        this.render();
        this.unsubscribe = chatService.subscribe(() => {
          this.render();
        });
    } catch (error) {
        console.log(error);
    }
  }

  disconnectedCallback() {}

  render() {
    const messages = chatService.getState().messages;
    this.innerHTML = /*html*/ `
        <div class="conversation-body">
            ${messages
              .map(
                (message) => /*html*/ `
                <c-message-bubble type="${
                  message.sender === this.user.id ? "out" : "in"
                }" message="${message.content}"></c-message-bubble>
            `
              )
              .join("")}
        </div>
        `;
  }
}
