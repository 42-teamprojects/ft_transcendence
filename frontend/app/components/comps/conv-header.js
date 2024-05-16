export default class Convheader extends HTMLElement {
    constructor() {
        super();
        this.imgAtt = this.getAttribute("img") || "none";
        this.usernameAtt = this.getAttribute("username") || "none";
        this.stateAtt = this.getAttribute("state") || "none";

    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conv-header">
            <img class="message-card__img" src="${this.imgAtt}" alt="user">
            <div class="flex-col gap-2">
                <div class="" >${this.usernameAtt}</div>
                <div class="">${this.stateAtt}</div>
            </div>
        </div>
        `;
    }
}

