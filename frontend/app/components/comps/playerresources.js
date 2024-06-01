export default class Playerresources extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center gap-12">
            <div class="flex-center gap-2 resource-count text-xs font-medium text-secondary">
                <i class="fa-solid fa-bell text-3xl"></i>
                <h3>3</h3>
            </div>
            <div class="flex-center gap-2 resource-count text-xs font-medium text-highlight">
                <img src="/public/assets/icons/streak.svg" alt="streak"/>
                <h3>1</h3>
            </div>
            </div>
        `;
    }
}

