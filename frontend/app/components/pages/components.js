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
            <div class="buttons mt-6">
                <button is="c-button" class="btn-primary">Get started</button>
                <button is="c-button" class="btn-secondary">Get started</button>
                <button is="c-button" class="btn-dark">Get started</button>
            </div>
        `;
    }
}
