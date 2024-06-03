import Router from "../../router/router.js";
import { matchState } from "../../state/matchState.js";
import Toast from "../comps/toast.js";
export default class Onlinegameplay extends HTMLElement {
    constructor() {
        super();
        this.params = new URLSearchParams(window.location.search);
        this.match_id = this.params.get('id');
        matchState.matchSetup(this.match_id);
    }

    connectedCallback() {
        
        this.render();
        this.unsubscribe = matchState.subscribe(() => {
            this.match = matchState.state.game;
            console.log("matchstate : ", this.match);
            if (this.match.playerLeft) {
                Toast.notify({ type: "warning", message: "Opponent left the match" });
                matchState.closeMatchConnection(this.match_id);
                Router.instance.navigate('/dashboard/home');
            }
            this.render();
        })
        // document.addEventListener('click', () => {
        //     matchState.closeMatchConnection(this.match_id);
        //     Router.instance.navigate('/dashboard/home');
        // });
    }

    disconnectedCallback() {
        this.unsubscribe();
    }

    render() {
        this.innerHTML = /*html*/`
        <c-online-pong-table match_id="${this.match_id}" id="table"></c-online-pong-table>
        `;
    }
}

customElements.define('p-onlinegameplay', Onlinegameplay);


// import Router from "../../router/router.js";
// import { matchState } from "../../state/matchState.js";
// import Toast from "../comps/toast.js";

// export default class Onlinegameplay extends HTMLElement {
//     constructor() {
//         super();
//         document.title = "online Gameplay | Blitzpong.";

//         // this.match = matchState.state.match
//         // if (this.match === null) {
//         //     Toast.notify({ type: "warning", message: "Please setup your game" })
//         //     Router.instance.navigate('/local/1v1')
//         //     return;
//         // }
//         // console.log(this.match)
//     }

//     // connectedCallback() {
//     //     if (this.match === null) return;
        
//     //     this.render();
//     //     this.cTable = this.querySelector('c-table');
//     //     this.cTable.addEventListener('game-over', this.handleGameOver.bind(this));
//     // }

//     // handleGameOver(e) {
//     //     const { winner } = e.detail;
//     //     matchState.setWinner(winner);
//     //     const modal = document.createElement('c-gameover-modal');
//     //     modal.setAttribute('player', winner.alias);
//     //     this.appendChild(modal);
//     //     setTimeout(() => {
//     //         this.querySelector('c-gameover-modal').open();
//     //     }, 100);
//     // }

//     disconnectedCallback() {
//         // this.cTable.removeEventListener('game-over', this.handleGameOver.bind(this));
//     }

//     render() {
//         this.innerHTML = /*html*/`
//             <h1>Online Gameplay</h1>
//         `;
//     }
// }
// // <c-online-pong-table id="table"></c-online-pong-table>


// customElements.define('p-onlinegameplay', Onlinegameplay);
