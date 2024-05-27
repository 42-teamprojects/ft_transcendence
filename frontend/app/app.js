import Authentication from "./auth/authentication.js";
import { Core } from "./core/core.js";
import Router from "./router/router.js";
import { routes } from "./routes.js";

class App {
	constructor(routes) {
		const router = new Router(routes);
		new Core();
		new Authentication();
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
