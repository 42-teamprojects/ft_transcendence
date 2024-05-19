export default class VerificationService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }

    async verifyTwoFactorAuth(otpObject) {
        return this.httpClient.post('security/verify-2fa/', otpObject);
    }

    async verifyEmail(otp) {
        return this.httpClient.post('auth/verify-email/', { otp });
    }
    
    // End-point not implemented yet
    async sendVerificationEmail(email) {
        return this.httpClient.post('auth/verification/send/', { email });
    }
    // Todo: Add other verification-related methods
}