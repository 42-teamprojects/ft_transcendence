import Router from "./router.js";

export default class Link extends HTMLAnchorElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      const href = this.getAttribute('href');
      const text = this.getAttribute('text') || this.innerHTML;
      this.innerHTML = text;
  
      this.addEventListener('click', (e) => {
        e.preventDefault();
        // Access the singleton Router instance for navigation
        const router = Router.instance;
        if (router) {
          router.navigate(href);
        } else {
          console.error('Router instance not found');
        }
      });
    }
}