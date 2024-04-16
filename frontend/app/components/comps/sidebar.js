export default class Sidebar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="sidebar">
            <c-logo class='py-4 pl-1'></c-logo>
            <c-sidebar-widget icon="home" active>home</c-sidebar-widget>
            <c-sidebar-widget icon="chat" >chat</c-sidebar-widget>
            <c-sidebar-widget icon="leaderboard" >ranking</c-sidebar-widget>
            <c-sidebar-widget icon="quests" >quests</c-sidebar-widget>
            <c-sidebar-widget icon="shop" >shop</c-sidebar-widget>
        </div>
        `;
    }
}

false