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
        <div class="widget-container card-border flex-col gap-4">
            <div class="title-bar flex justify-between items-center mb-3">
                <h1>Daily quests</h1>
                <a is="c-link" href="google.com" class="uppercase font-extrabold spacing-1">view all</a>
            </div>
            <div class="flex-col-center">
                <c-taskcard></c-taskcard>
            </div>
        </div>
        `;
    }
}

