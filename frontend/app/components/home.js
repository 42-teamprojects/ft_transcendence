export default class Home extends HTMLElement {
  constructor() {
    super();
    document.title = "Home";
  }

  static get observedAttributes() {
    return [];
  }

  attributeChangedCallback(name, oldValue, newValue) {}

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = /*html*/ `
        <c-counter></c-counter>
    `;
  }
}

customElements.define("c-home", Home);