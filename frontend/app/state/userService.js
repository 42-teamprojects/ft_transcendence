import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";
import Service from "./service.js";

class UserService extends Service {
	constructor() {
		super({ user: {} });
		this.httpClient = new HttpClient(config.rest_url);
	}

	async fetchMe() {
		try {
			const response = await this.httpClient.get("users/me/");
			this.setState({ user: response });
			return response;
		} catch (error) {
			console.error(error);
		}
	}

	reset() {
		this.setState({
			messages: [],
		});
	}
}

export const userService = new UserService();
