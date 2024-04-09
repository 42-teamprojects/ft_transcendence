import Http from "../http/http.js";
import Store from "./store.js";

class PostStore extends Store {
	constructor() {
		super({ posts: [], loading: true, errors: null }); // Add 'errors' state
	}

	async fetchPosts() {
		try {
			this.setState({ loading: true, errors: null }); // Set loading state
			const response = await Http.instance.doGet("posts/");
			const { posts } = await response.json();
			this.setPosts(posts);
		} catch (error) {
			console.error("Error fetching posts:", error);
			this.setError(error.message); // Set error in store
		} finally {
			this.setState({ loading: false }); // Update loading state after fetch completes
		}
	}

	async fetchPostsByKeyword(keyword) {
		try {
			this.setState({ loading: true, errors: null }); // Set loading state
			const response = await Http.instance.doGet("posts/search?q=" + keyword);
			const { posts } = await response.json();
			this.setPosts(posts);
		} catch (error) {
			console.error("Error fetching posts:", error);
			this.setError(error.message); // Set error in store
		} finally {
			this.setState({ loading: false }); // Update loading state after fetch completes
		}
	}

	setPosts(posts) {
		this.setState({ posts, loading: false, errors: null }); // Reset errors when setting posts
	}

	setError(error) {
		this.setState({ errors: error }); // Set error state
	}

	reset() {
		this.setState({ posts: [], loading: true, errors: null }); // Reset errors
	}
}

export const postStore = new PostStore();
