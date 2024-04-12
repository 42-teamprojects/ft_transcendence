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
        <c-paddle type="fire"></c-paddle>
        `;
    }
}
