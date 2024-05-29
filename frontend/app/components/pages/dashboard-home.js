import { userState } from "../../state/userState.js";

export default class Dashboard extends HTMLElement {
	constructor() {
		super();
		document.title = "Dashboard | Blitzpong.";
	}

	connectedCallback() {
		this.render();
        console.log(userState.getState());
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `  
        <div class="dashboard-content">
            <main>
                <div class="flex-center gap-6" >
                    <a is="c-link" href="/local/">
                        <c-card action='Play' title='Local Match' type="primary"></c-card>
                    </a>
                    <c-card action='Play' title='Online Match' type="secondary"></c-card>
                </div>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-friendscard></c-friendscard>
            </div>
        </div>
        `;
		// <c-dailyquestscard></c-dailyquestscard>
	}
}

customElements.define("p-dashboard-home", Dashboard);
