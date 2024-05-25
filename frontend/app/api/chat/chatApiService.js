import HttpClient from "../../http/httpClient.js";
import { config } from "../../config.js";

export default class ChatApiService {
    constructor() {
        this.httpClient = new HttpClient(config.rest_url);
    }

    async getUserChats() {
        try {
            const response = await this.httpClient.get('chats/');
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    async getChatMessages(chatId) {
        try {
            const response = await this.httpClient.get(`chats/${chatId}/messages/`);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}