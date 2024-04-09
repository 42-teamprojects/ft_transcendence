import Http from "../http/http.js";

export default class Post extends HTMLElement {
	constructor(params) {
		super();
		this.id = params.id;
		document.title = `Post ${this.id}`;
		this.post = {};
		this.loading = true;
		this.error = false;
	}

	static get observedAttributes() {
		return [];
	}

	attributeChangedCallback(name, oldValue, newValue) {}

	connectedCallback() {
		this.render();
		this.#fetchPost();
	}

	async #fetchPost() {
		try {
			const response = await Http.instance.doGet("posts/" + this.id);
			const data = await response.json()
			if (!response.ok)
				throw new Error(data.message);
			this.post = data;
		} catch (error) {
			console.error("Error fetching posts:", error);
			this.error = true;
		} finally {
			this.loading = false;
			this.render();
		}
	}

	render() {
		let content;

		if (this.loading) {
			content = "Loading...";
		} else if (this.error) {
			content = "Oops!!";
		} else {
			content = /*html*/ `
                <h1>Post ${this.post.id}</h1>
                <div>
                    <strong>ID:</strong> <span>${this.post.id}</span><br>
                    <strong>Title:</strong> <span>${this.post.title}</span><br>
                    <strong>Body:</strong> <span>${this.post.body}</span><br>
                    <strong>User ID:</strong> <span>${this.post.userId}</span><br>
                    <strong>Tags:</strong> <span>${this.post.tags.join(", ")}</span><br>
                    <strong>Reactions:</strong> <span>${this.post.reactions}</span><br>
                </div>
            `;
		}

		this.innerHTML = /*html*/`<div class="content">${content}</div>`;
	}
}
