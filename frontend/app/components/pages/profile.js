export default class Profile extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="dashboard-content">
            <main>
                <div class="profile-info">
                <h2>Yusuf Isawi</h2>
                <p>@yusufisawi</p>
                <p>Joined February 2023</p>
                <p>10 Following 10 Followers</p>
            </main>
        </div>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-friendscard></c-friendscard>
            </div>
        </div>
        `;
    }
}

customElements.define('p-profile', Profile);