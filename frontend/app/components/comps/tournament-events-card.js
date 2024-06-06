export default class Tournamenteventscard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
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
                <c-tournament-event></c-tournament-event>
            </div>
        </div>
        `;
    }
}

