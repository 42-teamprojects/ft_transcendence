export default class OAuthService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async continueWithOAuth(provider) {
        return this.httpClient.get(`oauth/login/${provider}/`);
    }

    async callbackOAuth(provider, code, state) {
        return this.httpClient.get(`oauth/callback/${provider}/?code=${code}&state=${state}`);
    }

    // Todo: Add other OAuth-related methods
}