import { chatState } from "../../state/chatState.js";
import { messageState } from "../../state/messageState.js";
import { userState } from "../../state/userState.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversationbody extends HTMLElement {
  constructor() {
    super();
    this.user = userState.state.user;
    this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)\/?$/);
    this.friendImg = this.getAttribute("friend-img") || "";
  }


  async connectedCallback() {
      this.render();
      this.unsubscribe = messageState.subscribe(() => this.render());
  }

  disconnectedCallback() {
      this.unsubscribe();
      // messageState.reset();
  }

  render() {
    const messages = messageState.state.messages[this.chatId] || [];
    const loading = messageState.state.loading;
    this.innerHTML = /*html*/ `
      <div class="conversation-body">
        ${loading ? /*html*/ `
          <div class="flex-center vh-full">
              <h1 class="text-xl font-medium">Loading messages...</h1>
          </div>
        ` : ""}
        ${messages
          .map(
            (message) => /*html*/ `
              <c-message-bubble type="${
                message.sender === this.user.id ? "out" : "in"
              }" message="${message.content}" img="${this.friendImg}"></c-message-bubble>
            `
          )
          .join("")}
      </div>
    `;
  }
}
