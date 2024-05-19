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
		Authentication.#instance = this;

		// Initialize services
		this.httpClient = new HttpClient(config.rest_url);
		this.authService = new AuthService(this.httpClient);
		this.oauthService = new OAuthService(this.httpClient);
		this.verificationService = new VerificationService(this.httpClient);
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

	// 2FA

	async verifyTwoFactorAuth(otp) {
		try {
			return await this.verificationService.verifyTwoFactorAuth(otp);
		} catch (error) {
			throw error;
		}
	}

	async enableTwoFactorAuth(otp) {
		try {
			return await this.verificationService.enableTwoFactorAuth(otp);
		} catch (error) {
			throw error;
		}
	}

	async getTwoFactorAuthSecret() {
		try {
			return await this.verificationService.getTwoFactorAuthSecret();
		} catch (error) {
			throw error;
		}
	}
}
