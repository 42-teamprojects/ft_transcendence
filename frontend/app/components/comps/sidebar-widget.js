export default class SidebarWidget extends HTMLElement {
    constructor() {
      super();
      this.icon_select = this.getAttribute("icon");
      this.icon = {
          HOME: "/public/assets/icons/home_Icon.svg",
          CHAT: "/public/assets/icons/chat_icon.svg",
          LEADERBOARD: "/public/assets/icons/leaderboard_Icon.svg",
          QUESTS: "/public/assets/icons/quests_Icon.svg",
          SHOP: "/public/assets/icons/shop_Icon.svg",
          MORE: "/public/assets/icons/more_Icon.svg"
      };
    }
  
    connectedCallback() {
      this.render();
    }
  
  
    render() {
      this.innerHTML = /*html*/`
        <div class="sidebar-widget">
          <div class="icon-theme">
            <img src="${this.icon[this.icon_select]}" alt="${this.icon_select}"/>
          </div>
          <div class="text-xs font-bold">${this.textContent}</div>
        </div>
      `;
    }
  }
  
  