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
                <section class="profile-info">
                    <div class="info">
                        <h2>Hamza Talhaouia</h2>
                        <p>htalhaou</p>
                        <h3>Joined February 2023</h3>
                    </div>
                    <div class="profile-image">
                        <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=hamza" alt="profile image">
                    </div>
                    <hr><span></span>
                </section>
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