export default class AuthService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async login(username, password) {
        const user = { username, password };
        return this.httpClient.post('auth/login/', user);
    }

    async register(user) {
        return this.httpClient.post('auth/register/', user);
    }

    async logout() {
        return this.httpClient.post('auth/logout/');
    }

    async isAuthenticated() {
        let retries = 3;

        while (retries > 0) {
            try {
                await this.httpClient.post('auth/jwt/verify/');
                return true;
            } catch (error) {
                if (error.status === 401) {
                    // Unauthorized, try refreshing token
                    await this.refreshToken();
                    retries--;
                } else {
                    throw error;
                }
            }
        }
        throw new Error("Authentication failed after multiple attempts");
    }

    async refreshToken() {
        return this.httpClient.post('auth/jwt/refresh/');
    }
}