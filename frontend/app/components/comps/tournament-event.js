export default class Tournamentevent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex justify-between">
            <div class="flex-col gap-3">
                <h3>4-Players Tournament</h3>
                <p class="text-stroke text-sm">Started, go to brackets</p> 
            </div>
            <button is="c-button" class="btn-secondary">View</button>
        </div>
        `;
    }
}

