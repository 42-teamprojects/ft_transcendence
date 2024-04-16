
// Define routes with all components as functions returning a promise
export const routes = [
  {
    path: "/",
    component: () => import("./components/pages/landing.js"),
  },
  {
    path: "/components",
    component: () => import("./components/pages/components.js"),
  },
  {
    path: "/local",
    component: () => import("./components/pages/local.js"),
  },
  {
    path: "/local/1v1",
    component: () => import("./components/pages/one-vs-one.js"),
  },
  {
    path: "/local/tournament",
    component: () => import("./components/pages/tournament.js"),
  },
  {
    path: "/local/game/1v1",
    component: () => import("./components/pages/gameplay.js"),
  },
  {
    path : "/local/tournament/qualifications",
    component: () => import("./components/pages/qualifications.js"),
  },
];
