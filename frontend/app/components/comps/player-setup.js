import { useFormData } from "../../utils/useForm.js";

export default class Playersetup extends HTMLElement {
    constructor() {
        super();
        this.playerId = this.getAttribute("player-id") || null;
        this.classStyle = this.playerId % 2 === 0 ? 'secondary' : 'primary';
        this.aliasInput;
    }

    connectedCallback() {
        this.render();
        this.aliasInput = this.querySelector('input[name=alias]');
        this.aliasInput.addEventListener('change', this.aliasFieldHandler.bind(this));

        this.querySelector('form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = useFormData(e.target).getObject();
            const alias = formData['alias'];
            const paddle = formData['paddle-option'];

            if (!this.checkAlias(alias, this.aliasInput)) return;

            this.dispatchEvent(new CustomEvent('player-ready', {
                detail: {
                    playerId: this.playerId,
                    alias,
                    paddle
                }
            }));

            this.querySelector('.btn-ready').disabled = true;
            this.querySelector('.btn-ready').textContent = 'Waiting...';

        });
    }

    aliasFieldHandler(e) {
        const alias = e.target.value;
        this.checkAlias(alias, e.target);
    }

    render() {
        this.innerHTML = /*html*/`
        <div class="player-setup player${this.playerId} flex-col px-4">
            <h2 class="text-${this.classStyle} mb-6 text-center">Player ${this.playerId}</h2>
            <div style="width: 285px">
                <form class="flex-col-center gap-5">
                    <div class="form-group">
                        <input type="text" name="alias" class="input-field" placeholder="Alias/Name"/>
                        <span class="input-error ml-3 text-danger hidden text-sm">Must be 3-20 characters</span>
                    </div>
                    <h3 class="font-medium">Choose a paddle</h3>
                    <div class="flex w-full justify-between gap-2">
                        <c-paddle-card type="fire" tooltip="Speed up your smashes" flow="up"></c-paddle-card>
                        <c-paddle-card type="basic" tooltip="Enlarge your paddle for 5sec" flow="up" checked></c-paddle-card>
                        <c-paddle-card type="ice" tooltip="Slow down your opponent" flow="up"></c-paddle-card>
                    </div>
                    <button type="submit" class="btn-${this.classStyle} w-full btn-ready">Ready</button>
                </form>
            </div>
        </div>
        `;
    }

    disconnectedCallback() {}

    checkAlias(alias, e) {
        const errorMsg = this.querySelector('.input-error');
        if (alias.length < 3 || alias.length > 20) {
            e.classList.add('error');
            errorMsg.classList.remove('hidden');
            return false;
        } else {
            e.classList.remove('error');
            errorMsg.classList.add('hidden');
            return true;
        } 
    }
}
