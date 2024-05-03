import Router from "../../router/router.js";
import { isThere } from "../../utils/utils.js";

export default class Sidebarmenu extends HTMLElement {
    constructor() {
      super();
      this.icons = {
          more: "/public/assets/game/sidebar-icons/more.svg",
      };
      this.isActive = isThere(["true", ""], this.getAttribute("active"), false);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "active") {
        this.isActive = isThere(["true", ""], newValue, false);
        this.render();
      }
    }

    static get observedAttributes() {
      return ["active"];
    }
  
    connectedCallback() {
      this.render();
    }

    disconnectedCallback() {
    }

    render() {
      this.innerHTML = /*html*/`
        <span class="sidebar-link ${this.isActive && 'active'}">
          <img src="${this.icons[this.link]}" alt="${this.link}"/>
          <div class="font-bold uppercase spacing-1" style="font-size: 14px">${this.textContent}</div>
        </span>
      `;
    }
  }
  
  