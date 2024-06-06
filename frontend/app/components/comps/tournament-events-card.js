import { onlineTournamentState } from "../../state/onlineTournamentState.js";

export default class Tournamenteventscard extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        this.innerHTML = this.getLoading();
        this.upcomingTournaments = await onlineTournamentState.getUpcomingTournaments();
        console.log(this.upcomingTournaments)
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Your Tournament Events</h1>
            </div>
            <div class="flex-col gap-8">
                ${this.upcomingTournaments.map(tournament => {
                    return /*html*/`<c-tournament-event href="/dashboard/tournaments/qualifications/${tournament.id}" type="${tournament.type}" status="${tournament.status}"></c-tournament-event>`
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

