export default class Sidebar extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        if (window.location.pathname.startsWith("/dashboard")) {
            console.log("dashboard");
            document.querySelector("router-outlet").parentElement.classList.add("content")
            this.render();
        }
    }

    disconnectedCallback() {
            document.querySelector("router-outlet").parentElement.classList.remove("content")
    }

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