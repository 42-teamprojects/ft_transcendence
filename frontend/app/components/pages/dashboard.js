export default class Dashboard extends HTMLElement {
    constructor() {
        super();
        document.title = "Dashboard | Blitzpong.";
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`  
        <div class="flex-center gap-6" >
            <c-card action='Play' title='Local Match' type="primary"></c-card>  
            <c-card action='Play' title='Online Match' type="secondary"></c-card>
        </div>
        <c-friendscard> 
        </c-friendscard>
        `;
    }
}

customElements.define('p-dashboard', Dashboard);