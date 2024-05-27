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
                const result = await this.httpClient.post('auth/jwt/verify/');
                return result;
            } catch (error) {
                if (error.code && error.code === 'token_not_valid') {
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