export default class VerificationService {
	constructor(httpClient) {
		this.httpClient = httpClient;
	}

	// Password reset
	async sendPasswordResetEmail(email) {
		return this.httpClient.post("auth/reset-password/", { email });
	}

	// Email verification
	async verifyEmail(otp) {
		return this.httpClient.post("auth/verify-email/", { otp });
	}

	// End-point not implemented yet
	async sendVerificationEmail(email) {
		return this.httpClient.post("auth/verification/send/", { email });
	}

	// 2FA
	async verifyTwoFactorAuth(otp) {
		return this.httpClient.post("security/verify-2fa/", { otp });
	}

	async enableTwoFactorAuth(data) {
		return this.httpClient.post("security/enable-2fa/", data);
	}

	async getTwoFactorAuthSecret() {
		return this.httpClient.get("security/get-2fa/");
	}

	// Todo: Add other verification-related methods
}
