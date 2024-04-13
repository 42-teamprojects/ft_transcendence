export default class Onevsone extends HTMLElement {
    constructor() {
        super();
        document.title = "One vs One";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-col-center vh-100 my-8 gap-8">
            <div>
                <h1 class="text-center mb-2">1 vs 1 Pong Match</h1>
                <h3 class="text-center font-medium text-stroke">Customize Your Game</h3>
            </div>
            <div class="flex justify-between w-full" style="max-width: 1200px">
                <div class="player-options player1 flex-col-center w-full">
                    <h2 class="text-primary mb-6">Player 1</h2>
                    <div style="width: 285px">
                        <form id="player1Form" class="flex-col-center gap-5">
                            <input type="text" name="player1-alias" class="input-field" placeholder="Alias/Name"/>
                            <h3 class="font-medium">Choose a paddle</h3>
                            <div class="flex w-full justify-between gap-2">
                                <c-paddle-card type="fire" tooltip="Speed up your smashes" flow="up"></c-paddle-card>
                                <c-paddle-card type="basic" tooltip="Enlarge your paddle for 5sec" flow="up" checked></c-paddle-card>
                                <c-paddle-card type="ice" tooltip="Slow down your opponent" flow="up"></c-paddle-card>
                            </div>
                            <button type="submit" class="btn-primary w-full">Ready</button>
                        </form>
                    </div>
                </div>
                
                <div class="vertical-line"></div>

                <div class="player-options player2 flex-col-center w-full" style="width: 285px">
                    <h2 class="text-secondary mb-6">Player 2</h2>
                    <div style="width: 285px">
                        <form id="player1Form" class="flex-col-center gap-5">
                            <input type="text" name="player2-alias" class="input-field" placeholder="Alias/Name"/>
                            <h3 class="font-medium">Choose a paddle</h3>
                            <div class="flex w-full justify-between gap-2">
                                <c-paddle-card type="fire" tooltip="Speed up your smashes" flow="up"></c-paddle-card>
                                <c-paddle-card type="basic" tooltip="Enlarge your paddle for 5sec" flow="up" checked></c-paddle-card>
                                <c-paddle-card type="ice" tooltip="Slow down your opponent" flow="up"></c-paddle-card>
                            </div>
                            <button type="submit" class="btn-secondary w-full">Ready</button>
                        </form>
                    </div>
                </div>
                
            </div>
        `;
    }
}
