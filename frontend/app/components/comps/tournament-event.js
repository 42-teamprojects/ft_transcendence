import { isTimePast, startCountdown } from "../../utils/utils.js";

export default class Tournamentevent extends HTMLElement {
    constructor() {
        super();
        this.type = this.getAttribute("type") || undefined;
        this.status = this.getAttribute("status") || undefined;
        this.href = this.getAttribute("href") || undefined;
        this.start_time = new Date(this.getAttribute("start-time")) || undefined;
    }

    connectedCallback() {
        this.render();
        console.log(isTimePast(this.start_time))
        this.timeRemaining = this.querySelector("#time-remaining");
        this.countdown = startCountdown(this.start_time, (output) => {
            this.timeRemaining.innerHTML = output;
        },
        () => {
            this.render();
        }
        );
    }

    disconnectedCallback() {
        clearInterval(this.countdown); // Clear the interval when the element is removed
    }

    render() {
        this.innerHTML = /*html*/`
        <div class="flex justify-between">
            <div class="flex-col gap-3">
                <h3>${this.type}-Players Tournament</h3>
                <p class="text-stroke text-sm">${this.status === 'NS' ? 'Waiting for players to join' : (this.status === 'IP' && isTimePast(this.start_time)) ? 'In Progress, Play or You lose' : (this.status === 'IP' && !isTimePast(this.start_time)) ? 'Starting in <span id="time-remaining">00:00</span>' : ''}</p> 
            </div>
            <button is="c-button" class="btn-secondary" href="${this.href}">View</button>
        </div>
        `;
    }
}

