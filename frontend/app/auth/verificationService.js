import HttpClient from "../http/httpClient.js";

export default class VerificationService {
	constructor() {
        this.httpClient = HttpClient.instance;
    }

	// Password reset
	async sendPasswordResetEmail(data) {
		return this.httpClient.post("auth/reset-password/", data);
	}

	async resetPassword(data) {
		return this.httpClient.post("auth/reset-password-confirm/", data)
	}

	// Email verification
	async verifyEmail(data) {
		return this.httpClient.post("auth/verify-email/", data);
	}

	// End-point not implemented yet
	async resendVerificationEmail() {
		return this.httpClient.post("auth/resend-verify-email/");
	}

	// 2FA
	async verifyTwoFactorAuth(data) {
		return this.httpClient.post("security/verify-2fa/", data);
	}

	async enableTwoFactorAuth(data) {
		return this.httpClient.post("security/enable-2fa/", data);
	}

	async getTwoFactorAuthSecret() {
		return this.httpClient.get("security/get-2fa/");
	}

	async reset2FA(data) {
		return this.httpClient.post("security/reset-2fa/", data)
	}

	async disableTwoFactorAuth(data) {
		return this.httpClient.post("security/disable-2fa/", data);
	}

	// Todo: Add other verification-related methods
}
