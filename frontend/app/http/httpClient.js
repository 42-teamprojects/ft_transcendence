import {config} from '../config.js';

export default class HttpClient {
	static #instance = null;

    constructor(baseURL) {
        if (HttpClient.#instance) {
            return HttpClient.#instance;
        }

        this.baseURL = baseURL || config.rest_url;
        HttpClient.#instance = this;
    }

    static get instance() {
        if (!HttpClient.#instance) {
            HttpClient.#instance = new HttpClient();
        }

        return HttpClient.#instance;
    }

	async fetch(endpoint, options, retries = 0) {
		// Dispatch the custom event to indicate the start of loading
		document.dispatchEvent(new CustomEvent('httpRequestStart'));

		try {
			const response = await fetch(this.baseURL + endpoint, {
				...options,
				headers: {
					Accept: "application/json, text/plain, */*",
					"Content-Type": "application/json",
					...options.headers,
				},
				credentials: "include",
			});

			let data;
			const contentType = response.headers.get("content-type");
			const isJson = contentType && contentType.includes("application/json");
			if (isJson) {
				data = await response.json();
			} else {
				data = await response.text();
			}

			if (!response.ok) {
				if (response.status === 401 && retries < 3) {
					// Unauthorized, try refreshing token
					await this.#refreshToken();
					return this.fetch(endpoint, options, retries + 1);
				}

				let error = data;
				error.status = response.status;
				// Handle 2fa required
				if (response.status === 423) {
					error = {
						status: response.status,
						detail: isJson ? data?.detail || data : data,
					};
				}
				throw error;
			}

			return data;
		} catch (error) {
			throw error;
		}
		finally {
			// Dispatch the custom event to indicate the completion of loading
			document.dispatchEvent(new CustomEvent('httpRequestEnd'));
		}
	}
	
	async get(endpoint, options = {}) {
		return this.fetch(endpoint, { ...options, method: "GET" });
	}

	async post(endpoint, body, options = {}) {
		return this.fetch(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });
	}

	async #refreshToken() {
        return this.post('auth/jwt/refresh/');
    }
	// Todo: Implement the rest of the HTTP methods
}
