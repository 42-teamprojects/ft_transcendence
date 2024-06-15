import { chatState } from "../state/chatState.js";
import { friendState } from "../state/friendState.js";
import { messageState } from "../state/messageState.js";
import { notificationState } from "../state/notificationState.js";
import { onlineTournamentState } from "../state/onlineTournamentState.js";
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

		// Initialize services
		this.authService = new AuthService();
		this.oauthService = new OAuthService();
		this.verificationService = new VerificationService();
		this.userService = new UserService();
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
			userState.setState({ user: null, token_verified_at: null });
			messageState.reset();
			chatState.reset();
			notificationState.closeSocket();
			await this.authService.logout();
		} catch (error) {
			throw error;
		}
	}

	async isAuthenticated() {
		try {
			const now = Date.now();
			const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

			// If it's been less than 5 minutes since the last verification, skip the call
			if (userState.state.token_verified_at && now - userState.state.token_verified_at < fiveMinutes) {
				return true;
			}
			
			const result = await this.authService.isAuthenticated();
			if (!result) {
				throw new Error("User not authenticated");
			}

			// Initialize the user state and sockets
			userState.setState({ user: result, token_verified_at: now });
			notificationState.setup();
			// get all messages for all chats
			await chatState.getChats();
			chatState.state.chats.forEach((chat) => {
				messageState.getMessages(chat.id);
			});
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

	async disableTwoFactorAuth(data) {
		try {
			return await this.verificationService.disableTwoFactorAuth(data);
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

	async changeUserData(data) {
		try {
			const { username, full_name, email } = data;
			return await this.userService.changeUserData(username, full_name, email);
		} catch (error) {
			throw error;
		}
	}
}
