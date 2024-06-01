import HttpClient from "../http/httpClient.js";

export default class UserService {
	constructor() {
        this.httpClient = HttpClient.instance;
    }

	async changePassword(new_password, current_password) {
        const data = {
            new_password: new_password,
            current_password: current_password,
        };
		return this.httpClient.put("users/set_password/", data);
	}
    async changeUserData(username, full_name, email) {
        const data = {
            username: username,
            full_name: full_name,
            email: email,
        };
		return this.httpClient.put("users/", data);
	}
}
