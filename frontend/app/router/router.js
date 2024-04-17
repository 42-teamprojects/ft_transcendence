import RouterOutler from "./router-outlet.js";
import Link from "./c-link.js";

export default class Router {
	static #instance = null;
	#subscribers = [];


	constructor(routes = []) {
		if (Router.#instance) {
			throw new Error('Use instance');
		}
		window.addEventListener("popstate", this.#renderCurrentRoute.bind(this));
		this.routes = routes;
		Router.#instance = this;
	}

	static get instance() {
		return Router.#instance || new Router();
	}

	addRoute(path, component) {
		this.routes.push({ path, component });
	}

	navigate(path, replace = false) {
		if (replace) {
			window.history.replaceState({}, "", path);
		} else {
			window.history.pushState({}, "", path);
		}
		this.#renderCurrentRoute();
	}

    onNavigation(callback) {
        this.#subscribers.push(callback);
    }

    offNavigation(callback) {
        this.#subscribers = this.#subscribers.filter(subscriber => subscriber !== callback);
    }

	isCurrentRoute(path) {
        return this.currentRoute === path;
    }

    get currentRoute() {
        return window.location.pathname;
    }

	#findRoute(path) {
		if (path.length > 1)
			path = path.replace(/\/$/, "");
		
		const url = new URL(window.location.href);
		const queryParams = Object.fromEntries(url.searchParams.entries());
		for (const route of this.routes) {
			const regex = `^${route.path.replace(/:[^\s/]+/g, "([^\\s/]+)")}$`;
			const match = path.match(new RegExp(regex));
			if (match) {
				const params = this.#extractParams(match, route.path);
				return { ...route, params: { ...params, ...queryParams } };
			}
		}
		return null;
	}

	#extractParams(match, routePath) {
		const keys = routePath.match(/:[^\s/]+/g) || [];
		const params = {};
		keys.forEach((key, index) => {
			params[key.replace(":", "")] = match[index + 1];
		});
		return params;
	}

	async #renderCurrentRoute() {
		const path = window.location.pathname;
		const matchedRoute = this.#findRoute(path);
		if (!matchedRoute || !matchedRoute.component) {
			console.error(`No route matched for ${path}`);
			this.back();
			return;
		}

		if (matchedRoute.redirectTo) {
			this.navigate(matchedRoute.redirectTo);
			return;
		}

		const outlet = document.querySelector("router-outlet");
		if (!outlet) {
			console.error("<router-outlet> element not found in the document.");
			return;
		}

		// Loading and instantiating the component
		try {
			const ComponentPromise = matchedRoute.component(); // This is now always a function returning a promise
			const Component = (await ComponentPromise).default || (await ComponentPromise); // Handle both ES modules and normal objects
			let componentInstance;
			if (Object.keys(matchedRoute.params).length > 0) componentInstance = new Component(matchedRoute.params);
			else componentInstance = new Component();

			outlet.innerHTML = "";
			outlet.appendChild(componentInstance);
			this.#subscribers.forEach(callback => callback());
		} catch (err) {
			console.error(`Failed to load component for route ${path}:`, err);
		}
	}

	// Spa reload
	reload() {
		this.#renderCurrentRoute();
	}

	back() {
		window.history.back();
	}

	forward() {
		window.history.forward();
	}

	init() {
		this.#renderCurrentRoute();
	}

}

// IMPORTANT !!
export const routerComponents = [
	{
		tagName: "router-outlet",
		component: RouterOutler,
	},
	{
		tagName: "c-link",
		component: Link,
		extends: "a",
	},
];
