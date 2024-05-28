import { messageState } from "../../state/messageState.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversationbody extends HTMLElement {
  constructor() {
    super();
    this.user = userState.getState().user;
    this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
  }


  async connectedCallback() {
      this.render();
      this.unsubscribe = messageState.subscribe(() => this.render());

      if (this.chatId) {
        await messageState.getMessages(this.chatId);
      }
  }

  disconnectedCallback() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
  }

  render() {
    const messages = messageState.getState().messages;
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
