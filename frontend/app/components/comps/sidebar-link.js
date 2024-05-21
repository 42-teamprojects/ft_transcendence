import Router from "../../router/router.js";
import { isThere } from "../../utils/utils.js";

export default class SidebarLink extends HTMLElement {
    constructor() {
      super();
      this.link = this.getAttribute("link");
      this.icons = {
          home: "/public/assets/game/sidebar-icons/home.svg",
          chat: "/public/assets/game/sidebar-icons/chat.svg",
          tournaments: "/public/assets/game/sidebar-icons/leaderboard.svg",
          settings: "/public/assets/game/sidebar-icons/settings.svg",
          shop: "/public/assets/game/sidebar-icons/shop.svg",
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
        <a is="c-link" href="/dashboard/${this.link}" class="sidebar-link ${this.isActive && 'active'}">
          <img src="${this.icons[this.link]}" alt="${this.link}"/>
          <div class="font-bold uppercase spacing-1">${this.textContent}</div>
        </a>
      `;
    }
  }
  
  