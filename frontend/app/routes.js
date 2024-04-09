import Post from "./components/post.js";
import Posts from "./components/posts.js";

// Define routes with all components as functions returning a promise
export const routes = [
  {
    path: "/",
    component: () => import("./components/home.js"), // Lazy-loaded
  },
  {
    path: "/posts",
    component: () => Promise.resolve(Posts), // Immediately available, wrapped in a Promise
  },
  {
    path: "/posts/:id",
    component: () => Promise.resolve(Post),
  },
  {
    path: "/asdf/asdf/asdf",
    component: () => Promise.resolve(Posts),
  },
];
