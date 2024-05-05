import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import { getWindowWidth } from "../../utils/utils.js";

export default class Logout extends HTMLElement {
    constructor() {
        super();
    }

    logout() {
        Authentication.instance.logout();
        Router.instance.navigate('/');
    }

    connectedCallback() {
        this.render();
        this.addEventListener('click', this.logout);
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.logout);
    }

    render() {
        this.innerHTML = /*html*/`
        <div class="sidebar-link" ${getWindowWidth() <= 1280 && `tooltip="Logout" flow="right"`}>
            <img src="/public/assets/game/sidebar-icons/logout2.svg" alt="logout icon"/>
            <div class="font-bold uppercase spacing-1">Logout</div>
        </div>
        `;
    }
}

