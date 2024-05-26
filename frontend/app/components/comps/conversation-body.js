// import { chatService } from "../../state/chatService.js";
// import ChatApiService from "../../api/chat/chatApiService.js";
// import { userService } from "../../state/userService.js";
// import { getMatchUrl } from "../../utils/utils.js";

// export default class Conversationbody extends HTMLElement {
//   constructor() {
//     super();
//     this.chatApiService = new ChatApiService();
//     this.user = userService.getState().user;
//     this.socket = null;
//     this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/)
//   }

//   async getChatMessages() {
//       if (!this.chatId) {
//         throw new Error("Chat id not found");
//       }
//       await chatService.getChatMessages(this.chatId);
//   }

//   async connectedCallback() {
    
//     try {
//         await this.getChatMessages();
//         this.render();
//         this.unsubscribe = chatService.subscribe(() => {
//           this.render();
//         });
//     } catch (error) {
//         console.log(error);
//     }
//     this.setupWebsocket()
//     this.sendMessage("hello this is me mouad")
//   }

//   disconnectedCallback() {}

//   setupWebsocket() {
//     const socketUrl = `ws://localhost:8000/ws/chat/${this.chatId}/`;
//     console.log(socketUrl)
//     const chatSocket = new WebSocket(socketUrl)
  
//     chatSocket.onopen = function(e) {
//       console.log("Connection established")
//     }
  
//     chatSocket.onmessage = function(e){
//         const data = JSON.parse(e.data);
//         console.log('Data', data);
//     }
  
//     chatSocket.onerror = function(e) {
//       console.error("WebSocket error: ", e);
//     }
//   }

//   sendMessage(message) {
//     if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
//         this.chatSocket.send(JSON.stringify({
//             'message': message
//         }));
//         console.log("Message sent:", message);
//     } else {
//         console.error("WebSocket is not open. Unable to send message.");
//     }
// }

//   render() {
//     const messages = chatService.getState().messages;
//     this.innerHTML = /*html*/ `
//         <div class="conversation-body">
//             ${messages
//               .map(
//                 (message) => /*html*/ `
//                 <c-message-bubble type="${
//                   message.sender === this.user.id ? "out" : "in"
//                 }" message="${message.content}"></c-message-bubble>
//             `
//               )
//               .join("")}
//         </div>
//         `;
//   }
// }

import { chatService } from "../../state/chatService.js";
import ChatApiService from "../../api/chat/chatApiService.js";
import { userService } from "../../state/userService.js";
import { getMatchUrl } from "../../utils/utils.js";

export default class Conversationbody extends HTMLElement {
  constructor() {
    super();
    this.chatApiService = new ChatApiService();
    this.user = userService.getState().user;
    this.socket = null;
    this.chatId = getMatchUrl(/^\/dashboard\/chat\/(\w+)$/);
  }

  async getChatMessages() {
    if (!this.chatId) {
      throw new Error("Chat id not found");
    }
    await chatService.getChatMessages(this.chatId);
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
    this.setupWebSocket(() => {
      this.sendMessage("hello this is me mouad");
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  setupWebSocket(callback) {
    const socketUrl = `ws://localhost:8000/ws/chat/${this.chatId}/`;
    console.log(socketUrl);
    this.chatSocket = new WebSocket(socketUrl);

    this.chatSocket.onopen = (e) => {
      console.log("Connection established");
      if (callback) callback();
    };

    this.chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log('Data', data);
    };

    this.chatSocket.onerror = (e) => {
      console.error("WebSocket error: ", e);
    };

    this.chatSocket.onclose = (e) => {
      console.log("WebSocket closed: ", e);
    };
  }

  sendMessage(message) {
    if (this.chatSocket && this.chatSocket.readyState === WebSocket.OPEN) {
      this.chatSocket.send(JSON.stringify({
        'message': message
      }));
    } else {
      console.error("WebSocket is not open. Unable to send message.");
    }
  }

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
