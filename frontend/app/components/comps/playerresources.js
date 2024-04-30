export default class Playerresources extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center gap-12">
            <div class="flex-center gap-2 resource-count text-xs font-medium text-highlight">
                <img src="/public/assets/icons/streak.svg" alt="streak"/>
                <h3>1</h3>
            </div>
            <div class="flex-center gap-2 resource-count text-xs font-medium text-secondary       ">
                <img src="/public/assets/icons/gems.svg" alt="gems"/>
                <h3>0</h3>
            </div>
            <div class="flex-center gap-2 resource-count text-xs font-medium text-danger">
                <img src="/public/assets/icons/heart.svg" alt="heart"/>
                <h3>5</h3>
            </div>
            </div>
        `;
    }
}

