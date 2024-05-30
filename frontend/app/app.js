import Authentication from "./auth/authentication.js";
import { config } from "./config.js";
import { Core } from "./core/core.js";
import HttpClient from "./http/httpClient.js";
import Router from "./router/router.js";
import { routes } from "./routes.js";

class App {
	constructor(routes) {
		const router = new Router(routes);
		new Core();
		new Authentication(config.rest_url);
		new HttpClient();
		router.init();  
		this.setupLoadingBar();
	}

	setupLoadingBar() {
    // Show loading bar on HTTP request start
		document.addEventListener("httpRequestStart", () => {
      if (document.querySelector('.loader-top')) {
        document.querySelector('.loader-top').classList.remove('hidden');
      }
		});
    
		// Hide loading bar on HTTP request end
		document.addEventListener("httpRequestEnd", () => {
      if (document.querySelector('.loader-top')) {
        document.querySelector('.loader-top').classList.add('hidden');
      }
		});
	}
}

new App(routes);
