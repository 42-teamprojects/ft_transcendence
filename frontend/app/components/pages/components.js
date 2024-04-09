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
            <div class="mx-8 my-4">
                <h1 class="font-extrabold">Components</h1>
                <div class="buttons my-8">
                    <h2 class="pb-3">Buttons</h2>
                    <button is="c-button" class="btn-primary">Button primary</button>
                    <button is="c-button" class="btn-secondary">Button secondary</button>
                    <button is="c-button" class="btn-dark">Button dark</button>
                </div>
            </div>
        `;
    }
}
