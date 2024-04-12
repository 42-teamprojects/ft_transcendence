export default class Card extends HTMLElement {
    constructor() {
        super();
        let types = ["primary", "secondary", "default"]
        this.actionAtt = this.getAttribute('action') || 'none'
        this.titleAtt = this.getAttribute("title") || 'none'
        this.typeAtt = types.includes(this.getAttribute("type")) 
            ? this.getAttribute("type") 
            : 'default'
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="bg-${this.typeAtt} rounded-xl flex-col-center hover" style="width:278px; height:189px">
            <span class="text-2xl font-medium opacity-75">${this.actionAtt}</span>
            <h1 class="text-full" >${this.titleAtt}</h1>
        </div>
        `;
    }
}