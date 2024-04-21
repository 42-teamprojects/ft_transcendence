export default class Logo extends HTMLElement {
    constructor() {
        super();
        this.href = this.getAttribute("href") || null;
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        ${this.href ? `<a is="c-link" href="${this.href}">` : ''}
            <div class="logo">
                
            </div>
        ${this.href ? '</a>' : ''}
        `;
    }
}
