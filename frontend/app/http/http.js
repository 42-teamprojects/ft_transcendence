import Authentication from "../auth/Authentication.js";
import { config } from "../config.js";
import Router from "../router/router.js";

export default class Http {
    static #instance = null;

    constructor() {
        if (Http.#instance) {
            throw new Error('Use instance');
        }
        Http.#instance = this;
    }

    /**
     * Get the singleton instance of Http class
     * @returns {Http} The singleton instance
     */
    static get instance() {
        return Http.#instance || new Http();
    }

    /**
     * Perform a GET request
     * @param {string} path - The URL path to request
     * @param {boolean} authentication - Indicates whether authentication is required
     * @returns {Promise<any>} A promise that resolves with the response data
     * @throws {Error} If the request fails
     */
    async doGet(path, authentication = false) {
        const headers = this.createHeaders(authentication);
        try {
            const response = await fetch(`${config.rest_url}${path}`, {
                headers
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error during GET request:', error);
            throw error;
        }
    }

    /**
     * Perform a POST request
     * @param {string} path - The URL path to request
     * @param {any} body - The request body
     * @param {boolean} authentication - Indicates whether authentication is required
     * @returns {Promise<any>} A promise that resolves with the response data
     * @throws {Error} If the request fails or if the user is unauthorized
     */
    async doPost(path, body, authentication = false) {
        const headers = this.createHeaders(authentication);
        try {
            const response = await fetch(`${config.rest_url}${path}`, {
                headers,
                method: 'POST',
                body
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error during POST request:', error);
            throw error;
        }
    }

    // Same as doPost
    async doPut(path, body, authentication = false) {
        const headers = this.createHeaders(authentication);
        try {
            const response = await fetch(`${config.rest_url}${path}`, {
                headers,
                method: 'PUT',
                body
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error during PUT request:', error);
            throw error;
        }
    }

    /**
     * Create headers for the request
     * @param {boolean} authentication - Indicates whether authentication is required
     * @returns {object} The request headers
     * @throws {Error} If the user is unauthorized
     */
    async doDelete(path, authentication = false) {
        const headers = this.createHeaders(authentication);
        try {
            const response = await fetch(`${config.rest_url}${path}`, {
                headers,
                method: 'DELETE'
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error during DELETE request:', error);
            throw error;
        }
    }

    /**
     * Create headers for the request
     * @param {boolean} authentication - Indicates whether authentication is required
     * @returns {object} The request headers
     * @throws {Error} If the user is unauthorized
     */
    createHeaders(authentication) {
        const headers = {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
        };
        if (authentication === true) {
            const auth = Authentication.instance.auth;
            if (auth && auth.token) {
                headers['Authorization'] = 'Bearer ' + auth.token;
            } else {
                Router.instance.navigate('/login');
                throw new Error('Unauthorized');
            }
        }
        return headers;
    }

    async handleResponse(response) {
        if (response.status === 401) {
            Router.instance.navigate('/login');
            throw new Error('Unauthorized');
        }
        
        return response;
    }
}
