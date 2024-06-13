import Router from "../../router/router.js";
import { onlineTournamentState } from "../../state/onlineTournamentState.js";

export default class Tournamenteventscard extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = this.getLoading();
        this.upcomingTournaments = await onlineTournamentState.getUpcomingTournaments();
        this.render();
        this.unsubscribe = onlineTournamentState.subscribe(async () => {
            this.innerHTML = this.getLoading();
            this.upcomingTournaments = await onlineTournamentState.getUpcomingTournaments();
            this.render();
        });
    }

    disconnectedCallback() {
        if (this.unsubscribe) this.unsubscribe();
    }

    render() {
        this.innerHTML = /*html*/`
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Your Tournament Events</h1>
            </div>
            <div class="flex-col gap-8">
                ${this.upcomingTournaments?.length === 0 ? /*html*/`<p class="text-stroke text-center">No upcoming tournaments</p>` : ""}
                ${this.upcomingTournaments?.map((tournament) => {
                    onlineTournamentState.setup(tournament.id)
                    return /*html*/`<c-tournament-event href="${tournament.status === 'NS' ? '/dashboard/tournaments' : `/dashboard/tournaments/qualifications/${tournament.id}`}" type="${tournament.type}" status="${tournament.status}" start-time="${tournament.start_time}"></c-tournament-event>`
                }).join("")}
            </div>
        </div>
        `;
    }

    getLoading() {
        return /*html*/ `
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Your Tournament Events</h1>
            </div>
            <div class="flex-col gap-8">
                <div class="flex justify-between">
                    <div class="w-full flex-col gap-3">
                        <h3 class="skeleton skeleton-small-text"></h3>
                        <p class="skeleton skeleton-text"></p> 
                    </div>
                    <div class="skeleton skeleton-micro"></div>
                </div>
                <div class="flex justify-between">
                    <div class="w-full flex-col gap-3">
                        <h3 class="skeleton skeleton-small-text"></h3>
                        <p class="skeleton skeleton-text"></p> 
                    </div>
                    <div class="skeleton skeleton-micro"></div>
                </div>
            </div>
        </div>
        `
    }
}

