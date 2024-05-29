import { config } from "../config.js";
import HttpClient from "../http/httpClient.js";
import { userState as userState } from "../state/userState.js";
import AuthService from "./authService.js";
import OAuthService from "./oAuthService.js";
import UserService from "./userService.js";
import VerificationService from "./verificationService.js";

export default class Authentication {
	static #instance = null;

	constructor() {
		if (Authentication.#instance) {
			throw new Error("Use instance");
		}
		Authentication.#instance = this;

		this.httpClient = new HttpClient(config.rest_url);
		// Initialize services
		this.authService = new AuthService(this.httpClient);
		this.oauthService = new OAuthService(this.httpClient);
		this.verificationService = new VerificationService(this.httpClient);
		this.userService = new UserService(this.httpClient);
	}

	static get instance() {
		return Authentication.#instance || new Authentication();
	}

	async login(data) {
		try {
			const { username, password } = data;
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
			// if (userState.getState().last_token_verified === null || new Date() >= userState.getState().last_token_verified) {
				const result = await this.authService.isAuthenticated();
				if (!result) {
					return false;
				}
				const timestampOffset = 1000 * 60 * 1; // 5 minutes in milliseconds
				userState.setState({ user: result, last_token_verified: new Date(Date.now() + timestampOffset) });
			// }
			return true;
		} catch (error) {
			throw error;
		}
	}

	async verifyEmail(data) {
		try {
			return await this.verificationService.verifyEmail(data);
		} catch (error) {
			throw error;
		}
	}

	async resendVerificationEmail() {
		try {
			return await this.verificationService.resendVerificationEmail();
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

	async verifyTwoFactorAuth(data) {
		try {
			return await this.verificationService.verifyTwoFactorAuth(data);
		} catch (error) {
			throw error;
		}
	}

	async enableTwoFactorAuth(data) {
		try {
			return await this.verificationService.enableTwoFactorAuth(data);
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

	async reset2FA(data) {
		try {
			return await this.verificationService.reset2FA(data);
		} catch (error) {
			throw error;
		}
	}

	// User
	async changePassword(data) {
		try {
			const { new_password, current_password } = data;
			return await this.userService.changePassword(new_password, current_password);
		} catch (error) {
			throw error;
		}
	}

	async resetPasswordEmail(data) {
		try {
			return await this.verificationService.sendPasswordResetEmail(data);
		} catch (error) {
			throw error;
		}
	}
	async resetPassword(data) {
		try {
			return await this.verificationService.resetPassword(data);
		} catch (error) {
			throw error;
		}
	}
}
