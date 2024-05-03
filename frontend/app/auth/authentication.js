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

    get auth() {
        return JSON.parse(localStorage.getItem('auth'));
    }

    set auth(value) {
        localStorage.setItem('auth', JSON.stringify(value));
    }

    onAuthenticate(callback) {
        this._callbacks.push(callback);
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
            if (!response.ok) {
                throw data;
            }
            this.auth = data;
            // this._callbacks.forEach(callback => callback(data));
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

    logout() {
        this.auth = null;
        localStorage.removeItem('auth');
        // this._callbacks.forEach(callback => callback(null));
    }

    isAuthenticated() {
        return !!this.auth;
    }

    async testAuthentication() {
        try {
            await this.login('yusufisawi', 'password');
            console.log('Current authentication status:', Authentication.instance.auth);
        } catch (error) {
            console.error(error);
        }
    }
}
