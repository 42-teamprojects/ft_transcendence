import Components from "./components/pages/components.js";
import Landing from "./components/pages/landing.js";

// Define routes with all components as functions returning a promise
export const routes = [
  {
    path: "/",
    component: () => Promise.resolve(Landing),
  },
  {
    path: "/components",
    component: () => Promise.resolve(Components),
  },
];
