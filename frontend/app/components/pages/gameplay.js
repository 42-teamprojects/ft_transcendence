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
        <c-paddlecard type="ice"></c-paddlecard>
        <c-table id="table"></table>
        `;
    }
}
