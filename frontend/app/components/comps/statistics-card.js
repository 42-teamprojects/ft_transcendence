export default class Statisticscard extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "none";
        this.numberAtt = this.getAttribute("number") || "none";
		this.textAtt = this.getAttribute("text") || "none";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex gap-6 py-4 px-6 border-dark rounded-xl">
            <img src="${this.imgAtt}" alt="icon" >
            <div class="flex-col gap-2">
                <h3 class="font-bold">${this.numberAtt}</h3>
                <p class="text-stroke">${this.textAtt}</p>
            </div>
        </div>
        `;
    }
}
