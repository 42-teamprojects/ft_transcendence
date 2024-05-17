import Service from "./service.js";

class ChatService extends Service {
	constructor() {
		super({
            messages: [],
        });
	}

	// {message: string, sender: me|them}
	addMessage(messageObject) {
		const messages = this.getState().messages;
		if (messageObject.message.startsWith("me:")) {
			messageObject.sender = "me";
			messageObject.message = messageObject.message.replace("me:", "");
		}
		// insert in front of the array
		messages.unshift(messageObject);
		this.setState({ messages });
	}

	reset() {
		this.setState({ 
			messages: [],
		});
	}
}

export const chatService = new ChatService();
