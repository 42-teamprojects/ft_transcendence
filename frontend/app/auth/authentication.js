import { config } from "../config.js";

export default class Authentication {
    static #instance = null;

    constructor() {
        if (Authentication.#instance) {
            throw new Error('Use instance');
        }
        this._callbacks = [];
        Authentication.#instance = this;
    }

    static get instance() {
        return Authentication.#instance || new Authentication();
    }

    async login(username, password) {
        const user = { username, password };
        try {
            const response = await fetch(config.rest_url + 'auth/login/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            console.log(data)
            if (!response.ok) {
                throw data;
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async register(user) {
        try {
            const response = await fetch(config.rest_url + 'auth/register/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await fetch(config.rest_url + 'auth/logout/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw response.json();
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    async isAuthenticated() {
        try {
            const response = await fetch(config.rest_url + 'auth/jwt/verify/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
        }
        catch (error) {
            if (error.status === 401) {
                // Unauthorized, try refreshing token
                try {
                    await this.refreshToken();
                }
                catch (error) {
                    throw error;
                }
            }
            throw error;
        } 
    }

    async refreshToken() {
        try {
            const response = await fetch(config.rest_url + 'auth/jwt/refresh/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });
            const data = await response.json();
            if (!response.ok) {
                throw data;
            }
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }

    async testAuthentication() {
        try {
            await this.login('yusufisawi', 'password');
        } catch (error) {
            console.error(error);
        }
    }
}
