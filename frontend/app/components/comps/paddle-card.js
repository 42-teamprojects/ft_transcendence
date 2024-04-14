import { isThere, toCapital } from "../../utils/utils.js";

export default class Paddlecard extends HTMLElement {
    constructor() {
        super();
        this.typeAtt = isThere(["fire", "ice", "basic"], this.getAttribute("type"), "basic");
        this.checkedAtt = isThere(["true", ""], this.getAttribute("checked"), false);
        this.isDisabled = isThere(["true", ""], this.getAttribute("disabled"), false);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "disabled") {
            this.isDisabled = isThere(["true", ""], newValue, false);
            if (this.isDisabled) this.removeEventListener('click', this.handleClick);
            this.radio.disabled = this.isDisabled;
        }
	}
    
	static get observedAttributes() {
        return ["disabled"];
	}
    
    connectedCallback() {
        this.render();
        this.radio = this.querySelector("input[name=paddle-option]");
        this.addEventListener('click', this.handleClick);
        if (this.checkedAtt !== false) this.radio.click();
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick);
    }

    handleClick() {
        this.radio.click();
    }

    render() {
        this.innerHTML = /*html*/`
        <input type="radio" class="hidden" name="paddle-option" value="${this.typeAtt}">
        <div class="bg paddlecard">
            <span class="mb-2">${toCapital(this.typeAtt)}</span>
            <div class="paddle paddle-${this.typeAtt}"></div>
        </div>
        `;
    }
}