import Router from "../../router/router.js";

export default class Sidebar extends HTMLElement {
    constructor() {
        super();
        this.router = Router.instance;
        this.handleNavigation = this.handleNavigation.bind(this);
    }
    
    connectedCallback() {
        this.router.onNavigation(this.handleNavigation);
    }

    disconnectedCallback() {
        this.router.offNavigation(this.handleNavigation);
    }

    handleNavigation() {
        const root = document.querySelector("#root");
        if (this.router.isCurrentRoute('/dashboard')) {
            root.classList.add('content')
        }
        else {
            root.classList.remove('content')
        }
        this.render();
    }

    render() {
        const shouldRender = this.router.isCurrentRoute('/dashboard');
        
        if (shouldRender) {
            this.innerHTML = /*html*/`
                <nav class="sidebar">
                    <c-logo class='py-4 pl-1'></c-logo>
                    <c-sidebar-link link="home" active>home</c-sidebar-link>
                    <c-sidebar-link link="chat" >chat</c-sidebar-link>
                    <c-sidebar-link link="rankings" >rankings</c-sidebar-link>
                    <c-sidebar-link link="quests" >quests</c-sidebar-link>
                    <c-sidebar-link link="shop" >shop</c-sidebar-link>
                </nav>
            `;
        } else {
            this.innerHTML = '';
        }
    }
}
