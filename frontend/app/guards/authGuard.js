import Authentication from "../auth/authentication.js";
import Toast from "../components/comps/toast.js";
import Router from "../router/router.js";
import CanActivate from "./canActivate.js";

export default class AuthGuard extends CanActivate {
    constructor() {
        super();
    }
    
	canActivate() {
		if (!!Authentication.instance.isAuthenticated()) {
			return true;
		} else {
			Router.instance.navigate(["/login"]);
            Toast.notify({ type: "warning", message: "You need to login to access this page" });
			return false;
		}
	}
}
