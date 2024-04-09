import { postStore } from "../state/postStore.js";

export default class Posts extends HTMLElement {
	constructor() {
		super();
		document.title = "Posts";
		this.unsubscribe = null;
	}

	static get observedAttributes() {
		return [];
	}

	attributeChangedCallback(name, oldValue, newValue) {}

	connectedCallback() {
		this.render();
		this.unsubscribe = postStore.subscribe(() => {
			this.render();
		});
		this.fetchPosts(); // Call fetchPosts method to initiate data fetching
	}

	disconnectedCallback() {
		if (this.unsubscribe) {
			this.unsubscribe(); // Unsubscribe from store updates
		}
	}

	async fetchPosts() {
		await postStore.fetchPosts(); // Call fetchPosts method from store
	}

	render() {
		const { posts, loading, errors } = postStore.getState(); // Get state from store

		let content;
		if (loading) {
			content = "Loading..."; // Display loading message
		} else if (errors) {
			content = `<div class="alert alert-danger" role="alert">Error: ${errors}</div>`; // Display error message with Bootstrap alert
		} else {
			const postsHtml = posts.map((post) => this.getPostTemplate(post)).join("");
			content = `<ul>${postsHtml}</ul>`;
		}

		this.innerHTML = /*html*/ `
            <div class="container">
                <h1 class="mt-5">Posts</h1>
                <c-searchpost class="mb-3"></c-searchpost>
                ${content}
            </div>
        `;
	}

	getPostTemplate(post) {
		return /*html*/ `
		<li class="list-group-item pt-2">
			<a is="c-link" href="/posts/${post.id}">${post.title}</a>
		</li>`;
	}
}
