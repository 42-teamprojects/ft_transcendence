export default class HttpClient {
	constructor(baseURL) {
		this.baseURL = baseURL;
	}

	async fetch(endpoint, options) {
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
			let error = data;
			// Handle 2fa required
			if (response.status === 423) {
				error = {
					status: response.status,
					detail: isJson ? data.detail : data,
				};
			}
			throw error;
		}

		return data;
	}
	async get(endpoint, options = {}) {
		return this.fetch(endpoint, { ...options, method: "GET" });
	}

	async post(endpoint, body, options = {}) {
		return this.fetch(endpoint, { ...options, method: "POST", body: JSON.stringify(body) });
	}

	// Todo: Implement the rest of the HTTP methods
}
