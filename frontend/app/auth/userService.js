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
}
