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
                    <div class="profile-image">
                        <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=hamza" alt="profile image">
                    </div>
                    <div class="profile-user">
                        <div class="profile-user-names">
                            <h2>Hamza Talhaouia</h2>
                            <p>htalhaou</p>
                        </div>
                        <h3>Joined February 2023</h3>
                    </div>
                </section>
                <hr class="divider">
                <section class="profile-bio">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Statistics</h2>
                    </div>
                    <div class="statistics">
                        <c-statistics-card img="/public/assets/icons/cho3la.svg" number="5" text="Games Played"></c-statistics-card>
                        <c-statistics-card img="/public/assets/icons/bar9.svg" number="8" text="Wins"></c-statistics-card>
                        <c-statistics-card img="/public/assets/icons/camera.svg" number="3" text="Losses"></c-statistics-card>
                    </div>
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