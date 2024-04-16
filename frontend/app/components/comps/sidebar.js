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
        <div>
            <c-logo class='p-5'></c-logo>
            <c-sidebar-widget icon="HOME" >HOME</c-sidebar-widget>
            <c-sidebar-widget icon="CHAT" >CHAT</c-sidebar-widget>
            <c-sidebar-widget icon="LEADERBOARD" >LEADERBOARD</c-sidebar-widget>
            <c-sidebar-widget icon="QUESTS" >QUESTS</c-sidebar-widget>
            <c-sidebar-widget icon="SHOP" >SHOP</c-sidebar-widget>
            <c-sidebar-widget icon="MORE" >MORE</c-sidebar-widget>
        </div>
        `;
    }
}

false