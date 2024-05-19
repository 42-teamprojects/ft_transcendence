import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";
import AuthService from "./authService.js";
import OAuthService from "./oAuthService.js";
import VerificationService from "./verificationService.js";

export default class Authentication {
	static #instance = null;

	constructor() {
		if (Authentication.#instance) {
			throw new Error("Use instance");
		}
		this.httpClient = new HttpClient(config.rest_url);
		this.authService = new AuthService(this.httpClient);
		this.oauthService = new OAuthService(this.httpClient);
		this.verificationService = new VerificationService(this.httpClient);
		Authentication.#instance = this;
	}

	static get instance() {
		return Authentication.#instance || new Authentication();
	}

	async login(username, password) {
		try {
			return await this.authService.login(username, password);
		} catch (error) {
			throw error;
		}
	}

	async register(user) {
		try {
			return await this.authService.register(user);
		} catch (error) {
			throw error;
		}
	}

	async logout() {
		try {
			await this.authService.logout();
		} catch (error) {
			throw error;
		}
	}

	async isAuthenticated() {
		try {
			return await this.authService.isAuthenticated();
		} catch (error) {
			throw error;
		}
	}

	async verifyTwoFactorAuth(otpObject) {
		try {
			return await this.verificationService.verifyTwoFactorAuth(otpObject);
		} catch (error) {
			throw error;
		}
	}

	async verifyEmail(otp) {
		try {
			return await this.verificationService.verifyEmail(otp);
		} catch (error) {
			throw error;
		}
	}

	// OAuth2
	async continueWithOAuth(provider) {
		try {
			return await this.oauthService.continueWithOAuth(provider);
		} catch (error) {
			throw error;
		}
	}

	async callbackOAuth(provider, code, state) {
		try {
			return await this.oauthService.callbackOAuth(provider, code, state);
		} catch (error) {
			throw error;
		}
	}
}
