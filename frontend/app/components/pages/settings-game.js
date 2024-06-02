import { PaddleType, TableTheme } from "../../entities/enums.js";
import { userState } from "../../state/userState.js";
import { useFormData } from "../../utils/useForm.js";
import { getKeyByValue } from "../../utils/utils.js";
import Toast from "../comps/toast.js";

export default class Settingsgame extends HTMLElement {
    constructor() {
        super();
        document.title = "Settings | Game";
        this.user = userState.state.user;
    }
    
    connectedCallback() {
        this.user = userState.state.user;
        this.render();

        this.paddlesForm = this.querySelector('.paddles-options');
        this.themesForm = this.querySelector('.themes-options');

        this.paddlesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const paddleName = useFormData(e.target).getObject()["paddle-option"]
            const paddle = getKeyByValue(PaddleType, paddleName);

            if (!paddle) {
                Toast.notify({message: "Invalid paddle type", type: "error"});
            }

            await userState.updateUserPaddle(paddle);
        });


        this.themesForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const themeOption = useFormData(e.target).getObject()["theme-option"];
            const theme = getKeyByValue(TableTheme, themeOption);

            if (!theme) {
                Toast.notify({message: "Invalid theme", type: "error"});
            }

            await userState.updateUserTheme(theme);
        });
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="dashboard-content">
            <main class="flex-col gap-16 mb-12">
                <div class="settings-header">
                    <h1 class="mb-2">Settings</h1>
                    <h3 class="font-normal text-stroke">Game, theme options, paddles...</h3>
                </div>
                <section class="your-paddle">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Your Paddle</h2>
                        <h4 class="font-normal text-stroke line-3">This will be your default paddle, change it before playing</h4>
                    </div>
                    <form class="paddles-options flex gap-2">
                        <c-paddle-card type="fire" tooltip="Speed up your smashes" flow="up" ${this.user.paddle_type === 'F' ? 'checked' : ''}></c-paddle-card>
                        <c-paddle-card type="basic" tooltip="Enlarge your paddle for 5sec" flow="up" ${this.user.paddle_type === 'B' ? 'checked' : ''}></c-paddle-card>
                        <c-paddle-card type="ice" tooltip="Slow down your opponent" flow="up" ${this.user.paddle_type === 'I' ? 'checked' : ''}></c-paddle-card>
                        <button is="c-button" class="btn-secondary ml-3" type="submit">Save changes</button>
                    </form>
                </section>
                <section class="your-themes">
                    <div class="settings-header mb-9">
                        <h2 class="mb-3">Your Table Theme</h2>
                        <h4 class="font-normal text-stroke line-3">This will be your default theme, change it before playing</h4>
                    </div>
                    <form class="themes-options flex flex-wrap gap-2">
                        <c-table-theme type="standard" ${this.user.table_theme === 'S' ? 'checked' : ''}></c-table-theme>
                        <c-table-theme type="classic" ${this.user.table_theme === 'C' ? 'checked' : ''}></c-table-theme>
                        <c-table-theme type="football" ${this.user.table_theme === 'F' ? 'checked' : ''}></c-table-theme>
                        <button is="c-button" class="btn-secondary my-2" type="submit">Save changes</button>
                    </form>
                </section>
            </main>
            <div class="widgets flex-col-center gap-5">
                <c-playerresources></c-playerresources>
                <c-settings-nav></c-settings-nav>
            </div>
        </div>
        `;
    }
}

customElements.define('p-settingsgame', Settingsgame);