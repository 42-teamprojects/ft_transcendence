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

	#findRoute(path, routes = this.routes) {
		if (path.length > 1)
			path = path.replace(/\/$/, "");
	
		const url = new URL(window.location.href);
		const queryParams = Object.fromEntries(url.searchParams.entries());
	
		const segments = path.split('/').filter(Boolean).map((s) => '/' + s); // Split path into segments
		if (segments.length === 0) segments.push('/'); // If path is just '/', add it as a segment
		// Helper function to recursively search for a route
		const findMatchingRoute = (segmentIndex, currentRoutes) => {
			for (const route of currentRoutes) {
				const regex = `^${route.path.replace(/:[^\s/]+/g, "([^\\s/]+)")}$`;
				const match = segments[segmentIndex].match(new RegExp(regex));
	
				if (match) {
					const params = this.#extractParams(match, route.path);
					let matchedRoute = { ...route, params: { ...params, ...queryParams } };
	
					// If the route has children and there are remaining segments, recursively search for a match
					if (route.children && segmentIndex < segments.length - 1) {
						const childMatchedRoute = findMatchingRoute(segmentIndex + 1, route.children);
						if (childMatchedRoute) {
							matchedRoute = { ...childMatchedRoute, parent: route };
						}
					}
	
					return matchedRoute;
				}
			}
			return null;
		};
	
		return findMatchingRoute(0, routes);
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
		const matchedRoute = this.#findRoute(path, this.routes);

		if (!matchedRoute || !matchedRoute.component) {
			this.navigate("/404");
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
