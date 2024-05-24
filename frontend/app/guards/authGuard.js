import Authentication from "../auth/authentication.js";
import Toast from "../components/comps/toast.js";
import Router from "../router/router.js";
import { userService } from "../state/userService.js";
import CanActivate from "./canActivate.js";

export default class AuthGuard extends CanActivate {
	constructor() {
		super();
	}

	async canActivate() {
		try {
			// method 1 : promise all
			const [isAuthenticated, user] = await Promise.all([
				Authentication.instance.isAuthenticated(),
				userService.fetchMe(),
			]);
			// method 2
			// await Authentication.instance.isAuthenticated();
			// await userService.fetchMe();
			return true;
		} catch (error) {
			console.error(error);
			try {
				await Authentication.instance.logout();
			}
			catch (error) {
				console.error(error);
			}
			Router.instance.navigate("/login");
			Toast.notify({ type: "warning", message: "You need to login to access this page" });
			return false;
		}
	}
}
