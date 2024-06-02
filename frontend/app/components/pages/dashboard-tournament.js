export default class Dashboardtournament extends HTMLElement {
	constructor() {
		super();
        document.title = "Tournaments | BlitzPong";
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
        <div class="dashboard-content">
            <main class="flex-col gap-16 mb-12">
                <section class="on-going-tournaments">
                    <div class="mb-9">
                        <h2 class="mb-3">On-going tournaments</h2>
                        <h4 class="font-normal text-stroke line-3">Join the latest BlitzPong tournaments and compete for the top spot on the leaderboard.</h4>
                    </div>
                    <div class="tournament-cards">
                        <c-tournament-card players="4"></c-tournament-card>
                        <c-tournament-card players="8" type="waitingPlayers"></c-tournament-card>
                        <c-tournament-card players="16"></c-tournament-card>
                    </div>
                </section>
                <section class="leaderboard">
                    <div class="mb-9">
                        <h2 class="mb-3">Leaderboard</h2>
                        <h4 class="font-normal text-stroke line-3"></h4>
                    </div>
                    <div class="leaderboard-table">
                        <c-leaderboard-table></c-leaderboard-table>
                    </div>
                </section>

            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-friendscard></c-friendscard>
            </div>
        </div>
        `;
	}
}

customElements.define("p-dashboardtournament", Dashboardtournament);
