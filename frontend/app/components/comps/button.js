import Router from "../../router/router.js";

export default class Button extends HTMLButtonElement {
	constructor() {
		super();
	}


	connectedCallback() {
		const href = this.getAttribute("href");
		const text = this.getAttribute("text") || this.innerHTML;
		this.innerHTML = text;

        if (href) {
            this.addEventListener("click", () => {
                Router.instance.navigate(href);
            });
        }
	}
}
