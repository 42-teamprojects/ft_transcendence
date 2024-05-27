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

	isVerified() {
        return this.state.user.provider === 'fortytwo' ? true : this.state.user.is_verified;
	}

	isProvider() {
		return this.state.user.provider !== null;
	}

	is2FAEnabled() {
		return this.state.user.two_factor_enabled;
	}

	reset() {
		this.setState({
			user: {},
		});
	}
}

export const userService = new UserService();
