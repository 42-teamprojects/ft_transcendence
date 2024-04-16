export default class Dashboard extends HTMLElement {
    constructor() {
        super();
        document.title = "Dashboard | Blitzpong.";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <h1>dashboard</h1>
        `;
    }
}

customElements.define('p-dashboard', Dashboard);