export default class Table extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center">
            <canvas class="table"></canvas>
        </div>
        `;
    }
}
