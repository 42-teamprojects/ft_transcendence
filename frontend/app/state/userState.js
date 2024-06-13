import Toast from "../components/comps/toast.js";
import HttpClient from "../http/httpClient.js";
import State from "./state.js";

class UserState extends State {
	constructor() {
		super({
			user: {},
			token_verified_at: null,
		});
		this.httpClient = HttpClient.instance;
	}


	async getMyMatchesHistory() {
		try {
			const response = await this.httpClient.get("matches/");
			return response;
		} catch (error) {
			console.error(error);
		}
	
	}

	async getUserMatchesHistory(userId) {
		try {
			const response = await this.httpClient.get(`matches/${userId}/`);
			return response;
		} catch (error) {
			console.error(error);
		}
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

	async fetchUser(username) {
		try {
			const result = await this.httpClient.get(`users/${username}/`);
			return result;
		} catch (error) {
			console.error(error);
		}
	}
	async fetchUserById(userId) {
		try {
			const result = await this.httpClient.get(`users/get/${userId}/`);
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	updateUser(field, value) {
		const user = this.state.user;
		user[field] = value;
		this.setState({ user });
	}

	async updateUserPaddle(value) {
		try {
			await this.httpClient.put("auth/paddle-type/", { paddle_type: value });
			this.updateUser("paddle_type", value);
			Toast.notify({ type: "success", message: "Paddle type updated successfully" });
		} catch (error) {
			console.error(error);
			Toast.notify({ type: "error", message: "Failed to update paddle type" });
		}
	}
	async updateUserTheme(value) {
		try {
			await this.httpClient.put("auth/table-theme/", { table_theme: value });
			this.updateUser("table_theme", value);
			Toast.notify({ type: "success", message: "Theme type updated successfully" });
		} catch (error) {
			console.error(error);
			Toast.notify({ type: "error", message: "Failed to update theme type" });
		}
	}

	isVerified() {
		return this.state.user.provider === "fortytwo" ? true : this.state.user.is_verified;
	}

	isProvider() {
		return this.state.user.provider !== null;
	}

	is2FAEnabled() {
		return this.state.user.two_factor_enabled;
	}

	setEnable2FA(value) {
		this.updateUser("two_factor_enabled", value);
	}

	reset() {
		this.setState({
			user: {},
			token_verified_at: null,
		});
	}
}

export const userState = new UserState();
