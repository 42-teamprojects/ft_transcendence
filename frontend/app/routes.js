import Components from "./components/pages/components.js";
import Gameplay from "./components/pages/gameplay.js";
import Landing from "./components/pages/landing.js";
import Local from "./components/pages/local.js";
import Onevsone from "./components/pages/one-vs-one.js";

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
  {
    path: "/game/1v1",
    component: () => Promise.resolve(Gameplay),
  },
  {
    path: "/one-vs-one",
    component: () => Promise.resolve(Onevsone),
  },
];
