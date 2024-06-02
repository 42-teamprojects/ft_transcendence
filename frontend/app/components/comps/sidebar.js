import Authentication from "../../auth/authentication.js";
import Router from "../../router/router.js";
import { getWindowWidth, toCapital } from "../../utils/utils.js";

export default class Sidebar extends HTMLElement {
	constructor() {
		super();
		this.router = Router.instance;
		this.handleNavigation = this.handleNavigation.bind(this);
		this.links = ["home", "chat", "tournaments", "profile", "settings"];
	}

	connectedCallback() {
		this.router.onNavigation(this.handleNavigation);
	}

	disconnectedCallback() {
		this.router.offNavigation(this.handleNavigation);
	}

	handleNavigation() {
		const body = document.querySelector("body");
		if (window.location.pathname.startsWith("/dashboard")) {
			body.classList.add("content");
		} else {
			body.classList.remove("content");
		}
		this.render();
		window.addEventListener("resize", () => this.render());
	}

	addTooltip(link) {
		return getWindowWidth() <= 1280 ? `tooltip="${toCapital(link)}" flow="right"` : "";
	}

	render() {
		const shouldRender = window.location.pathname.startsWith("/dashboard");

		const sidebarLinks = this.links
			.map(
				(link) => /*html*/ `
            <c-sidebar-link link="${link}" active="${this.router.currentRoute.startsWith(
					"/dashboard/" + link
				)}" ${this.addTooltip(link)}>
                ${link}
            </c-sidebar-link>
        `
			)
			.join("");

		if (shouldRender) {
			this.innerHTML = /*html*/ `
                <nav class="sidebar">
                    <div class="sidebar-top">
                        <c-logo class='py-4 pl-1' href="/"></c-logo>
                        ${sidebarLinks}
                    </div>
                    <div class="sidebar-bottom">
                       <c-logout></c-logout>
                    </div>
                </nav>
            `;
		} else {
			this.innerHTML = "";
		}
	}
}
