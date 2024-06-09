import { onlineTournamentState } from "../../state/onlineTournamentState.js";

export default class Dashboardtournament extends HTMLElement {
	constructor() {
		super();
        document.title = "Tournaments | BlitzPong";
        this.tournamentState = onlineTournamentState;
	}

	async connectedCallback() {
		this.render();
        this.tournamentCards = this.querySelector(".tournament-cards");
        this.unsubscribe = this.tournamentState.subscribe(() => {
            this.tournamentCards.innerHTML = this.getTournamentsCards();
            
        });
        await onlineTournamentState.getNotStartedTournaments();
	}

	disconnectedCallback() {
        this.unsubscribe();
    }

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
                        ${this.getTournamentsCards()}
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
	}

    getTournamentsCards() {
        return ['4', '8', '16'].map(players => {
            const tournament = this.tournamentState.isTournamentTypeExists(players);
            return /*html*/`
            ${tournament 
            ?  /*html*/`<c-tournament-card tournament-id="${tournament.id}" players="${players}" type="waitingPlayers"></c-tournament-card>`
            : /*html*/`<c-tournament-card players="${players}"></c-tournament-card>`
            }`
        }).join('');
    }
}

customElements.define("p-dashboardtournament", Dashboardtournament);

{/* <section class="leaderboard">
    <div class="mb-9">
        <h2 class="mb-3">Leaderboard</h2>
        <h4 class="font-normal text-stroke line-3"></h4>
    </div>
    <div class="leaderboard-table">
        <c-leaderboard-table></c-leaderboard-table>
    </div>
</section> */}