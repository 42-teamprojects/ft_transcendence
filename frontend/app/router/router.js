import RouterOutler from "./router-outlet.js";
import Link from "./c-link.js";
import { trimSlashes } from "../utils/utils.js";

export default class Router {
	static #instance = null;
	#subscribers = [];
	prevPath = null;

	constructor(routes = []) {
		if (Router.#instance) {
			throw new Error("Use instance");
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
		this.#subscribers = this.#subscribers.filter((subscriber) => subscriber !== callback);
	}

	isCurrentRoute(path) {
		return this.currentRoute === path;
	}

	routeLike(route) {
		return this.currentRoute === route || this.currentRoute === route + '/';
	}

	get currentRoute() {
		return trimSlashes(window.location.pathname);
	}

	currentRouteEndsWith(string) {
		return this.currentRoute.endsWith(string) || this.currentRoute.endsWith(string + "/");
	}

	currentRouteStartsWith(string) {
		return this.currentRoute.startsWith(string);
	}

	#findRoute(path, routes = this.routes) {
		if (path.length > 1) path = path.replace(/\/$/, "");

		const url = new URL(window.location.href);
		const queryParams = Object.fromEntries(url.searchParams.entries());

		// find first exact match using regex
		const exactMatch = routes.find((route) => {
			const regex = `^${route.path.replace(/:[^\s/]+/g, "([^\\s/]+)")}$`;
			return new RegExp(regex).test(path);
		});

		if (exactMatch) {
			const params = this.#extractParams(path, exactMatch.path);
			return { ...exactMatch, params: { ...params, ...queryParams } };
		}

		const segments = path
			.split("/")
			.filter(Boolean)
			.map((s) => "/" + s); // Split path into segments
		if (segments.length === 0) segments.push("/"); // If path is just '/', add it as a segment

		// Helper function to recursively search for a route
		const findMatchingRoute = (segmentIndex, currentRoutes) => {
			for (const route of currentRoutes) {
				const regex = `^${route.path.replace(/:[^\s/]+/g, "([^\\s/]+)")}$`;
				const match = segments[segmentIndex].match(new RegExp(regex));
				
				if (match) {
					const params = this.#extractParams(path, route.path);
					let matchedRoute = { ...route, params: { ...params, ...queryParams } };
					
					// If the route has children and there are remaining segments, recursively search for a match
					if (route.children && segmentIndex < segments.length - 1) {
						const childMatchedRoute = findMatchingRoute(segmentIndex + 1, route.children);
						if (childMatchedRoute) {
							matchedRoute = { ...childMatchedRoute, parent: route };
						}
						else {
							return null;
						}
					}
					return matchedRoute;
				}
			}
			return null;
		};

		return findMatchingRoute(0, routes);
	}

	#extractParams(path, routePath) {
		const pathSegments = path.split("/");
		const routeSegments = routePath.split("/");
		const params = {};

		for (let i = 0; i < routeSegments.length; i++) {
			const routeSegment = routeSegments[i];
			if (routeSegment.startsWith(":")) {
				const key = routeSegment.slice(1);
				const value = pathSegments[i];
				params[key] = value;
			}
		}
		return params;
	}

	async #renderCurrentRoute() {
		const path = trimSlashes(window.location.pathname);
		const matchedRoute = this.#findRoute(path, this.routes);

		if (!matchedRoute || !matchedRoute.component) {
			window.history.replaceState({}, "", this.prevPath || "/");
			this.navigate("/404");
			return;
		}

		this.prevPath = path;

		if (matchedRoute.redirectTo) {
			this.navigate(matchedRoute.redirectTo);
			return;
		}

		// Check if canActivate guards are defined for the route
		const guards =
			matchedRoute.parent && matchedRoute.parent.canActivate
				? matchedRoute.parent.canActivate
				: matchedRoute.canActivate || false;
		if (guards) {
			const canActivateResults = await Promise.all(
				guards.map((guard) => {
					const guardObj = new guard();
					return guardObj.canActivate();
				})
			);
			const guardsResults = canActivateResults.every((result) => result === true);
			if (!guardsResults) {
				console.warn("Access denied. You do not have permission to access this page.");
				return;
			}
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

			while (outlet.firstChild) {
				outlet.removeChild(outlet.firstChild);
			}
			outlet.appendChild(componentInstance);
			this.#subscribers.forEach((callback) => callback());
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
