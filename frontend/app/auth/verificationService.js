export default class VerificationService {
	constructor(httpClient) {
		this.httpClient = httpClient;
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
	async sendVerificationEmail(data) {
		return this.httpClient.post("auth/verification/send/", data);
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

	// Todo: Add other verification-related methods
}