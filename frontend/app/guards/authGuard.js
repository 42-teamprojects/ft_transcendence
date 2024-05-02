import Authentication from "../auth/authentication.js";
import Toast from "../components/comps/toast.js";
import Router from "../router/router.js";
import CanActivate from "./canActivate.js";

class AuthGuard extends CanActivate {
    constructor() {
        super();
    }
    
	canAcitvate() {
		if (!!Authentication.instance.isAuthenticated()) {
			return true; // Allow access if the user is authenticated
		} else {
			Router.instance.navigate(["/login"]);
            Toast.notify({ type: "warning", message: "You need to login to access this page" });
			return false; // Prevent access to the route
		}
	}
}

const authGuard = new AuthGuard();

export default authGuard;