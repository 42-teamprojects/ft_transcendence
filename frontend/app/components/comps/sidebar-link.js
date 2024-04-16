import Router from "../../router/router.js";
import { isThere } from "../../utils/utils.js";

export default class SidebarLink extends HTMLElement {
    constructor() {
      super();
      this.link = this.getAttribute("link");
      this.icons = {
          home: "/public/assets/game/sidebar-icons/home.svg",
          chat: "/public/assets/game/sidebar-icons/chat.svg",
          rankings: "/public/assets/game/sidebar-icons/leaderboard.svg",
          quests: "/public/assets/game/sidebar-icons/quest.svg",
          shop: "/public/assets/game/sidebar-icons/shop.svg",
      };
      this.isActive = this.getAttribute("active");
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
      this.querySelector(".sidebar-link").addEventListener("click", this.#handleNavigation.bind(this));
    }

    #handleNavigation() {
        Router.instance.navigate("/dashboard/" + this.link);
    }

    disconnectedCallback() {
      this.querySelector(".sidebar-link").removeEventListener("click", this.#handleNavigation);
    }

    render() {
      this.innerHTML = /*html*/`
        <div class="sidebar-link ${this.isActive !== null && 'active'}">
          <img src="${this.icons[this.link]}" alt="${this.link}"/>
          <div class="font-bold uppercase spacing-1" style="font-size: 14px">${this.textContent}</div>
        </div>
      `;
    }
  }
  
  