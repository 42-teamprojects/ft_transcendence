import Button from "./components/button.js";
import Components from "./components/pages/components.js";
import { routerComponents } from "./router/router.js";

// Define the components of the layouts and their tagname
export const layoutComponents = [
];

// Define the components of the app and their tagname
export const components = [
  ...layoutComponents, // IMPORTANT: Keep this line
  ...routerComponents, // IMPORTANT: Keep this line
	{ tagName: 'c-components', component: Components },
	{ tagName: 'c-button', component: Button, extends: 'button'},
];
