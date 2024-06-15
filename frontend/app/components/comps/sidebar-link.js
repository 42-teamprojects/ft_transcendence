import { config } from "../../config.js";
import { userState } from "../../state/userState.js";
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
      this.unsubscribe = userState.subscribe(() => {
        if (this.link === "profile" && userState.state.user) this.render();
      });
    }

    disconnectedCallback() {
      this.unsubscribe();
    }

    render() {
      const user = userState.state.user;
      const avatar = user.avatar ? config.backend_domain + user.avatar : `https://api.dicebear.com/8.x/thumbs/svg?seed=${user.username}`;
      this.innerHTML = /*html*/`
        <a is="c-link" href="/dashboard/${this.link}" class="sidebar-link ${this.isActive && 'active'}">
          ${this.link === "profile"
            ? /*html*/`<img class="profile_icon object-cover skeleton" src="${avatar}" alt="profile image">`
            : /*html*/`<img src="${this.icons[this.link]}" alt="${this.link}"/>`
          }
          <div class="font-bold uppercase spacing-1">${this.textContent}</div>
        </a>
      `;
    }
  }
  
  // ${(this.isSeen === false) ? /*html*/`<div class="dot"></div>` : '' } 