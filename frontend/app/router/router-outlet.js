export default class RouterOutlet extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return [];
    }

    attributeChangedCallback(name, oldValue, newValue) {

    }

    connectedCallback() {
        var template = /*html*/`
              <div id="router-outlet">Router outlet</div>
        `;
        this.innerHTML = template;
    }
}
