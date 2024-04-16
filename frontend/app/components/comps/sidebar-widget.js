import { isThere } from "../../utils/utils.js";

export default class SidebarWidget extends HTMLElement {
    constructor() {
      super();
      this.icon_select = this.getAttribute("icon");
      this.icon = {
          home: "/public/assets/game/sidebar-icons/home.svg",
          chat: "/public/assets/game/sidebar-icons/chat.svg",
          leaderboard: "/public/assets/game/sidebar-icons/leaderboard.svg",
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
    }

    render() {
      this.innerHTML = /*html*/`
        <div class="sidebar-widget ${this.isActive !== null && 'active'}">
          <div class="icon-theme">
            <img src="${this.icon[this.icon_select]}" alt="${this.icon_select}"/>
          </div>
          <div class="font-bold uppercase spacing-1" style="font-size: 14px">${this.textContent}</div>
        </div>
      `;
    }
  }
  
  