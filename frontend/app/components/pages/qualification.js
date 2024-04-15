export default class Qualification extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div>
            <c-bracket8></c-bracket8>
            <c-bracket4></c-bracket4>
         </div>
        `;
    }
}

customElements.define('p-qualification', Qualification);