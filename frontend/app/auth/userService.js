export default class UserService {
	constructor(httpClient) {
		this.httpClient = httpClient;
	}

	async changePassword(new_password, current_password) {
        const data = {
            new_password: new_password,
            current_password: current_password,
        };
        console.log(data)
		return this.httpClient.post("auth/users/set_password/", data);
	}
}
