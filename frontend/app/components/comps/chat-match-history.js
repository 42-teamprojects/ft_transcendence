export default class Chatmatchhistory extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="chat-match-history">
            <div class="chat-header mb-6">
                <div class="flex-center gap-4">
                    <h1 class="font-bold text-2xl">Matches History</h1>
                </div>
                <button is="c-button" class="btn-primary w-0">
                    <i class="fa-solid fa-circle-info text-xl"></i> 
                </button>
            </div>
            <div class="flex-col-center gap-6 px-5">
            ${
                true ? /*html*/`
                <p class="line-4 text-stroke">
                    Last 4 matches with msodor
                </p>
                <c-match-history me="yusufisawi" them="msodor" my-score="3" their-score="5"></c-match-history>
                <c-match-history me="yusufisawi" them="msodor" my-score="2" their-score="3"></c-match-history>
                <c-match-history me="yusufisawi" them="msodor" my-score="5" their-score="3"></c-match-history>
                <c-match-history me="yusufisawi" them="msodor" my-score="1" their-score="3"></c-match-history>
                ` :
                /*html*/`
                <p class="line-4 text-stroke">
                    You have no matches with msodor yet.
                </p>
                <button is="c-button" class="btn-secondary">
                    Start a match with them now!
                </button>
                `
            }
            </div>
        </div>
        `;
    }
}

