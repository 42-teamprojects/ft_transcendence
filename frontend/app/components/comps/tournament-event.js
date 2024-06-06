export default class Tournamentevent extends HTMLElement {
    constructor() {
        super();
        this.type = this.getAttribute("type") || undefined;
        this.status = this.getAttribute("status") || undefined;
        this.href = this.getAttribute("href") || undefined;
        this.start_time = this.getAttribute("start-time") || undefined;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex justify-between">
            <div class="flex-col gap-3">
                <h3>${this.type}-Players Tournament</h3>
                <p class="text-stroke text-sm">${this.status === 'NS' ? 'Starting in 5:09' : this.status === 'IP' ? 'In Progress, Play or You lose' : ''}</p> 
            </div>
            <button is="c-button" class="btn-secondary" href="${this.href}">View</button>
        </div>
        `;
    }
}

