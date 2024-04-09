export default class Components extends HTMLElement {
    constructor() {
        super();
        document.title = "Components";
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = /*html*/`
        <h1>components</h1>
        `;
    }
}
