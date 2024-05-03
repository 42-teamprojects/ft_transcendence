import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";

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

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <span class="sidebar-link" id="#logout">
            <img src="/public/assets/game/sidebar-icons/logout2.svg" alt="logout icon"/>
            <div class="font-bold uppercase spacing-1">Logout</div>
        </span>
        `;
    }
}

