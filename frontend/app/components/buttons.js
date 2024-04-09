import { counterStore } from "../state/counterStore.js";

export default class Buttons extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /*html*/ `
<button id="decrement">-</button>
<button id="increment">+</button>
`;

    this.shadowRoot.getElementById("increment").addEventListener(
      "click",
      () => counterStore.increment()
    );

    this.shadowRoot.getElementById("decrement").addEventListener(
      "click",
      () => counterStore.decrement()
    );
  }
}
