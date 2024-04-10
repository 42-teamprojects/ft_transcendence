import Toast from "./components/comps/toast.js";
import Logo from "./components/comps/logo.js";
import Landing from "./components/pages/landing.js";
import Modal from "./components/comps/modal.js";
import Button from "./components/comps/button.js";
import Components from "./components/pages/components.js";
import { routerComponents } from "./router/router.js";

// Define the components of the layouts and their tagname
export const layoutComponents = [
];

// Define the components of the app and their tagname
export const components = [
  ...layoutComponents, // IMPORTANT: Keep this line
  ...routerComponents, // IMPORTANT: Keep this line
	{ tagName: 'p-components', component: Components },
	{ tagName: 'c-button', component: Button},
	{ tagName: 'c-modal', component: Modal },
	{ tagName: 'p-landing', component: Landing },
	{ tagName: 'c-logo', component: Logo },
	{ tagName: 'c-toast', component: Toast },
];
