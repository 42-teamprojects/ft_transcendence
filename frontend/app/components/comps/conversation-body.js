import { chatState } from "../../state/chatState.js";
import ChatApiService from "../../api/chat/chatApiService.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl } from "../../utils/utils.js";
import Router from "../../router/router.js";

export default class Conversationbody extends HTMLElement {
  constructor() {
    super();
    this.chatApiService = new ChatApiService();
    this.user = userState.getState().user;
    this.socket = null;
    this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
  }

  async getChatMessages() {
    if (!this.chatId) {
      throw new Error("Chat id not found");
    }
    await chatState.getChatMessages(this.chatId);
  }

  async connectedCallback() {
    try {
      await this.getChatMessages();
      this.render();
      this.unsubscribe = chatState.subscribe(() => {
        this.render();
      });
    } catch (error) {
      console.log(error);
      Router.instance.back();
    }

  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const messages = chatState.getState().messages;
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
