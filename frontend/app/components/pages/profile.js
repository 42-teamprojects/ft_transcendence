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
                        <div class="flex items-center gap-5 follow"> 10 following <span class="dot"></span> 10 followers</div>
                    </div>
                    <div class="profile-image">
                        <img src="https://api.dicebear.com/8.x/thumbs/svg?seed=hamza" alt="profile image">
                </section>
                <section class="statistics">
                    <div class="stat">1 Win streak</div>
                    <div class="stat">8 Wins</div>
                    <div class="stat">0 Losses</div>
                    <div class="stat">Bronze Current league</div>
                <section class="achievements">
                <h3>Achievements</h3>
                    <div class="achievement">
                        <p>Wildfire</p>
                        <p>Reach a 3 win streak</p>
                        <progress value="1" max="3"></progress>
                    </div>
                </section>
                <section class="matches-history">
                    <h3>Matches History</h3>
                    <div class="match">
                        <p>Wildfire</p>
                        <p>Reach a 3 win streak</p>
                        <progress value="1" max="3"></progress>
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