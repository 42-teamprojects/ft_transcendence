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
				if (data.detail !== "No active account found with the given credentials" && response.status === 401 && retries < 3) {
					// Unauthorized, try refreshing token
					await this.#refreshToken();
					return this.fetch(endpoint, options, retries + 1);
				}

				let error = data;
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

	async put(endpoint, body, options = {}) {
		return this.fetch(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) });
	}

	async patch(endpoint, body, options = {}) {
		return this.fetch(endpoint, { ...options, method: "PATCH", body: JSON.stringify(body) });
	}

	async delete(endpoint, options = {}) {
		return this.fetch(endpoint, { ...options, method: "DELETE" });
	}

	async upload(endpoint, formData, retries = 0) {
		try {
			const response = await fetch(this.baseURL + endpoint, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                })
			const data = await response.json();
			if (!response.ok) {
				if (response.status === 401 && retries < 3) {
					// Unauthorized, try refreshing token
					await this.#refreshToken();
					return this.upload(endpoint, formData, retries + 1);
				}
				let error = data;
				error.status = response.status;
				throw error;
			}
			return data;
		} catch (error) {
			throw error;
		}
	}

	async #refreshToken() {
        return this.post('auth/jwt/refresh/');
    }
	// Todo: Implement the rest of the HTTP methods
}
