import Router from "../../router/router.js";

export default class Button extends HTMLButtonElement {
	constructor() {
		super();
		this.oldInnerText;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "text") {
			this.innerHTML = newValue;
		}

		if (name === "processing") {
			if (newValue === "true") {
				this.oldInnerText = this.innerHTML;
				this.setAttribute("disabled", "true");
				this.innerHTML = `<span class="loader-btn"></span>`;
			} else if (newValue === "false") {
				this.removeAttribute("disabled");
				this.innerHTML = this.oldInnerText;
			} else {
				this.removeAttribute("disabled");
			}
		}
	}

	static get observedAttributes() {
		return ["text", "processing"];
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
