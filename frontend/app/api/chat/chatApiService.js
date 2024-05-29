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

    async saveMessage(chatId, message) {
        try {
            const response = await this.httpClient.post(`chats/${chatId}/messages/`, { "content": message });
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    async createChat(friendId) {
        try {
            const response = await this.httpClient.post('chats/', { "user2": friendId });
            return response;
        } catch (error) {
            if (error.status === 400 && error.detail === "Chat already exists") {
                return await this.getChat(error.more.chat_id);
            }
            console.error(error);
        }
    }

    async getChat(chatId) {
        try {
            const response = await this.httpClient.get(`chats/${chatId}/`);
            return response;
        } catch (error) {
            console.error(error);
        }
    }
}