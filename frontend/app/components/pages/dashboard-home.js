import { userState } from "../../state/userState.js";
import { formatDate } from "../../utils/utils.js";

export default class Dashboard extends HTMLElement {
	constructor() {
		super();
		document.title = "Dashboard | Blitzpong.";
	}

	async connectedCallback() {
        this.matchElements = "";
		this.render();
        this.user = userState.state.user;
        this.matchHistory = await userState.getMyMatchesHistory() || [];
		this.matchElements = this.matchHistory.slice(0, 5).map((match) => {
            const me = [match.player1, match.player2].find(p => p.id === this.user.id);
            const them = [match.player1, match.player2].find(p => p.id !== this.user.id);
            const myScore = match.player1.id === this.user.id ? match.score1 : match.score2;
            const theirScore = match.player1.id !== this.user.id ? match.score1 : match.score2;
            return /*html*/ `<c-match-history me="${me.username}" my-avatar=${me.avatar} them="${them.username}" their-avatar=${them.avatar} my-score="${myScore}" their-score="${theirScore}" tooltip="${formatDate(match.created_at)}" flow="right"></c-match-history>`
        });
        if (this.matchElements.length > 0) {
            this.querySelector(".history-header").innerHTML = `Last ${this.matchElements.length} matches`;
            this.querySelector(".match-history-container").innerHTML = this.matchElements.join("");
        }
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
                    <a is="c-link" href="/online/1v1/">
                        <c-card action='Play' title='Online Match' type="secondary"></c-card>
                    </a>
                </div>
                <section class="my-9">
                    <div class="settings-header mb-6">
                        <h2 class="mb-3 history-header"></h2>
                    </div>
                    <div class="match-history-container flex-col gap-4">
                    </div>
                </section>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-friendscard></c-friendscard>
                <c-tournament-events-card></c-tournament-events-card>
            </div>
        </div>
        `;
		// <c-dailyquestscard></c-dailyquestscard>
	}
}

customElements.define("p-dashboard-home", Dashboard);
