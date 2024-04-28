export default class Friendscard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="container card-border flex-col gap-4">
                <div class="title-bar flex justify-between items-center mb-3">
                    <h1>Friends</h1>
                    <a is="c-link" href="google.com" class="uppercase font-extrabold spacing-1">view all</a>
                </div>
                <div class="grid grid-cols-4 grid-center gap-5">
                    <c-usercard username="Hassan" status="offline" img="https://api.dicebear.com/8.x/avataaars/svg?seed=Baby"></c-usercard>
                    <c-usercard username="Jhon Dofggdsgdfge" status="online" img="https://api.dicebear.com/8.x/avataaars/svg?seed=Garfield"></c-usercard>
                    <c-usercard username="Jhon Doe" status="playing" img="https://api.dicebear.com/8.x/avataaars/svg?seed=Luna"></c-usercard>
                    <c-usercard username="Jhon Doe" status="playing" img="https://api.dicebear.com/8.x/avataaars/svg?seed=Luna"></c-usercard>
                    <c-usercard username="Jhon Doe" status="playing" img="https://api.dicebear.com/8.x/avataaars/svg?seed=Luna"></c-usercard>
                    <c-usercard username="Jhon Doe" status="playing" img="https://api.dicebear.com/8.x/avataaars/svg?seed=Luna"></c-usercard>
                </div>
            </div>
        `;
    }
}

