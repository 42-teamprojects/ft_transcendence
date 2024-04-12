export default class Local extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() { }

    render() {
        this.innerHTML = /*html*/`
        <h1>local</h1>
        <c-card action='Play' title='1 vs 1' type="primary"></c-card>
        <c-card action='Play' title='Tournament' type="secondary"></c-card>
        `;
    }
}
