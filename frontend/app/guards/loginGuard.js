import Authentication from "../auth/authentication.js";
import Toast from "../components/comps/toast.js";
import Router from "../router/router.js";
import CanActivate from "./canActivate.js";

export default class LoginGuard extends CanActivate {
    constructor() {
        super();
    }
    
	async canActivate() {
		try {
			await Authentication.instance.isAuthenticated();
			Router.instance.navigate("/dashboard/home");
			return false;
		}
		catch (error) {
			return true;
		}
	}
}
