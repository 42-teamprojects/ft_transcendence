import Components from "./components/pages/components.js";

// Define routes with all components as functions returning a promise
export const routes = [
  {
    path: "/components",
    component: () => Promise.resolve(Components),
  },
];
