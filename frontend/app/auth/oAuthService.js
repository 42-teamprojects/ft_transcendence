import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";

export default class OAuthService {
    constructor() {
        this.httpClient = HttpClient.instance;
    }

    async continueWithOAuth(provider) {
        window.location.replace(config.rest_url + `oauth/login/${provider}`);
    }

    async callbackOAuth(provider, code, state) {
        return this.httpClient.get(`oauth/callback/${provider}/?code=${code}&state=${state}`);
    }

    // Todo: Add other OAuth-related methods
}