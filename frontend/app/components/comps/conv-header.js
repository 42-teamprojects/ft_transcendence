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
            <div class="flex-center gap-4">
                <img class="message-card__img" src="${this.imgAtt}" alt="user">
                <div class="flex-col gap-2">
                    <div class="conv-header__username" >${this.usernameAtt}</div>
                    <div class="conv-header__status gap-2">
                        <div class="conv-header__status__dot playing"></div>
                        <div class="conv-header__status__text capitalize">${this.stateAtt}</div>
                    </div>
                </div>
            </div>
            <button is="c-button" class="btn-primary capitalize">play</button>
        </div>
        `;
    }
}

