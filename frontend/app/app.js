import Authentication from "./auth/authentication.js";
import { Core } from "./core/core.js";
import Http from "./http/http.js";
import Router from "./router/router.js";
import { routes } from "./routes.js";

class App {
  constructor(routes) {
    const router = new Router(routes);
    new Core();
    new Authentication();
    new Http();
    router.init();
  }
}

new App(routes);

// if (!Authentication.instance.auth) {
  // await Authentication.instance.testAuthentication();
// }
