export default class Usercardloading extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="usercard flex-col-center">
            <div class="object-cover w-12 h-12 skeleton skeleton-circle mb-2"></div>
            <h3 class="username white-space pt-1 cursor-pointer skeleton skeleton-text"></h3>
            <p class="user-status skeleton skeleton-text"></p>
        </div>
        `;
    }
}

