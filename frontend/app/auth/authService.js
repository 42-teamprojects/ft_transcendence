import HttpClient from "../http/httpClient.js";

export default class AuthService {
    constructor() {
        this.httpClient = HttpClient.instance;
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
        try {
            const result = await this.httpClient.post('auth/jwt/verify/');
            return result;
        } catch (error) {
            throw error;
        }
    }

    async refreshToken() {
        return this.httpClient.post('auth/jwt/refresh/');
    }
}