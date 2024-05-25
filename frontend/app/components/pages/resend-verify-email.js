export default class Resendverifyemail extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <h1>resendverifyemail</h1>
        `;
    }
}

customElements.define('p-resendverifyemail', Resendverifyemail);