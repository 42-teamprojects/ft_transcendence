export default class Dailyquestscard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="card-border">
            <h1 class="text-primary">Daily Quests</h1>
        </div>
        `;
    }
}

