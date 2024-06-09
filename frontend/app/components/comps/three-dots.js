export default class ThreeDots extends HTMLElement {
    constructor() {
        super();
        this.color = this.getAttribute('color') || 'white';
        this.text = this.getAttribute('text') || '';
    }

    connectedCallback() {
        this.render();
        this.dots = this.querySelectorAll('.single-dot');
        for (let i = 0; i < this.dots.length; i++) {
            this.dots[i].style.backgroundColor = `${this.color}`;
        }
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="flex-center align-end gap-5">
            ${this.text==="" ? '' : /*html*/`<h1>${this.text}</h1>` }
            <div class="dots">
                <div class="single-dot"></div>
                <div class="single-dot"></div>
                <div class="single-dot"></div>
            </div>    
        </div>
        `;
    }
}
