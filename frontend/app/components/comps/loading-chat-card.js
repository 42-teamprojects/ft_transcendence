export default class Loadingchatcard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="message-card">
            <div class="skeleton skeleton-circle"></div>
            <div class="w-full flex-col gap-2">
                <div class="skeleton skeleton-small-text"></div>
                <div class="skeleton skeleton-text"></div>
            </div>
            <div class="message-card__time skeleton skeleton-micro"></div>
        </div>
        `;
    }
}

