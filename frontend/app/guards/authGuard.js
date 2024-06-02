import Authentication from "../auth/authentication.js";
import Toast from "../components/comps/toast.js";
import Router from "../router/router.js";
import { userState } from "../state/userState.js";
import CanActivate from "./canActivate.js";

export default class AuthGuard extends CanActivate {
	constructor() {
		super();
	}

	async canActivate() {
		try {
			await Authentication.instance.isAuthenticated();
			return true;
		} catch (error) {
			console.error(error);
			Router.instance.navigate("/login");
			Toast.notify({ type: "warning", message: "You need to login to access this page" });
			return false;
		}
	}
}
