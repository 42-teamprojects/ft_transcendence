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
                    <c-usercard username="HassanOigag" status="offline" img="https://api.dicebear.com/8.x/thumbs/svg?seed=Casper"></c-usercard>
                    <c-usercard username="YusufIsawi" status="online" img="https://api.dicebear.com/8.x/thumbs/svg?seed=Garfield"></c-usercard>
                    <c-usercard username="Jhonesnow" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=youssef"></c-usercard>
                    <c-usercard username="msodor" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=mouad"></c-usercard>
                    <c-usercard username="hassssan" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=hassan"></c-usercard>
                    <c-usercard username="hamzaaa" status="playing" img="https://api.dicebear.com/8.x/thumbs/svg?seed=hamza"></c-usercard>
                </div>
            </div>
        `;
    }
}

