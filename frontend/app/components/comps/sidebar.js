import Router from "../../router/router.js";

export default class Sidebar extends HTMLElement {
    constructor() {
        super();
        this.router = Router.instance;
        this.handleNavigation = this.handleNavigation.bind(this);
        this.links = ["home", "chat", "rankings", "quests", "shop"]
    }
    
    connectedCallback() {
        this.router.onNavigation(this.handleNavigation);
    }

    disconnectedCallback() {
        this.router.offNavigation(this.handleNavigation);
    }

    handleNavigation() {
        const root = document.querySelector("#root");
        if (window.location.pathname.startsWith('/dashboard')) {
            root.classList.add('content')
        }
        else {
            root.classList.remove('content')
        }
        this.render();
    }

    render() {
        const shouldRender = window.location.pathname.startsWith('/dashboard');

        const sidebarLinks = this.links.map(link => /*html*/`
            <c-sidebar-link link="${link}" active="${this.router.isCurrentRoute('/dashboard/' + link)}">
                ${link}
            </c-sidebar-link>
        `).join('');
        
        if (shouldRender) {
            this.innerHTML = /*html*/`
                <nav class="sidebar">
                    <c-logo class='py-4 pl-1' href="/"></c-logo>
                    ${sidebarLinks}
                </nav>
            `;
        } else {
            this.innerHTML = '';
        }
    }
}
