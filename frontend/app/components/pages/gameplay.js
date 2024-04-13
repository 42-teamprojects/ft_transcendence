export default class Gameplay extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <c-paddle-card type="ice"></c-paddle-card>
        <c-table id="table"></table>
        `;
    }
}
