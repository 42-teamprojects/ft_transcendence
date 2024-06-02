export default class Matchmaking extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
            <div class="match-making-container flex-col  flex-center gap-40">
                <h1>Match starts in ...3</h1>
                <div class="flex flex-center gap-30">
                    <div class="flex flex-col gap-5">
                        <img src="https://images.unsplash.com/photo-1716798781407-1c1767955e2e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMHx8fGVufDB8fHx8fA%3D%3D" alt="player1" class="player-img">
                        <h2 class="text-secondary text-3xl">Player 1</h2>
                    </div>
                    <h1 class="text-6xl font-black spacing-10">VS</h1>
                    <div class="flex flex-col gap-5">
                        <img src="https://plus.unsplash.com/premium_photo-1716138192476-f34e85ad43c2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D" alt="player1" class="player-img">
                        <h2 class="text-primary text-3xl">Player 2</h2>
                    </div>
                </div>
                <button class="btn-primary">quit match</button>
            </div>
        `;
    }
}

customElements.define('p-matchmaking', Matchmaking);