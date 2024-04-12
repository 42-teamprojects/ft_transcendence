import Components from "./components/pages/components.js";
import Gameplay from "./components/pages/gameplay.js";
import Landing from "./components/pages/landing.js";
import Local from "./components/pages/local.js";

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
  {
    path: "/local",
    component: () => Promise.resolve(Local),
  },
  {
    path: "/gameplay",
    component: () => Promise.resolve(Gameplay),
  },
];
