import { isThere, toCapital } from "../../utils/utils.js";

export default class Tabletheme extends HTMLElement {
    constructor() {
        super();
        this.typeAtt = isThere(["classic", "standard", "football"], this.getAttribute("type"), "standard")
        this.checkedAtt = isThere(["true", ""], this.getAttribute("checked"), false)
        this.themes = {
            classic: "/public/assets/game/tables/classic.svg",
            standard: "/public/assets/game/tables/standard.svg",
            football: "/public/assets/game/tables/football.svg"
        }
    }
    
    connectedCallback() {
        this.render();
        this.radio = this.querySelector("input[name=theme-option]");
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
        <input type="radio" class="hidden" name="theme-option" value="${this.typeAtt}">
        <div class="table-theme">
            <span class="mb-4 font-medium text-lg mt-2">${toCapital(this.typeAtt)}</span>
            <img src="${this.themes[this.typeAtt]}" alt="${this.typeAtt} theme" />
        </div>
        `;
    }
}
