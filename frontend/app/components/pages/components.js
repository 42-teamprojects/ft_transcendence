import { useFormData } from "../../utils/useForm.js";
import Toast from "../comps/toast.js";

export default class Components extends HTMLElement {
	constructor() {
		super();
		document.title = "Components";
	}

	connectedCallback() {
		this.render();
        // Handling Modal events
		const modal = this.querySelector("c-modal");

		modal.addEventListener("confirm", () => {
			console.log("Confirmed...");
		});

		modal.addEventListener("cancel", () => {
			console.log("Cancelled...");
		});

        // Handling Toast events
		document.getElementById("notify").addEventListener("click", () => {
			Toast.notify({ type: "success", message: "Your changes have been saved" });
		});
		document.getElementById("notify1").addEventListener("click", () => {
			Toast.notify({ type: "error", message: "Some thing went wrong" });
		});
		document.getElementById("notify2").addEventListener("click", () => {
			Toast.notify({ type: "warning", message: "Some thing went wrong" });
		});
		document.getElementById("notify3").addEventListener("click", () => {
			Toast.notify({ type: "info", message: "Some thing went wrong" });
		});

        // Handling Paddle Options form
		this.querySelector("#paddlesForm").addEventListener("submit", (e) => {
			e.preventDefault();
			this.querySelector("#selected-paddle").innerText = `Selected paddle: ${
				useFormData(e.target).getObject()["paddle-option"]
			}`;
		});
        // Handling Table Themes form
		this.querySelector("#themesForm").addEventListener("submit", (e) => {
			e.preventDefault();
			this.querySelector("#selected-theme").innerText = `Selected theme: ${
				useFormData(e.target).getObject()["theme-option"]
			}`;
		});
	}

	render() {
		this.innerHTML = /*html*/ `
            <div class="mx-8 my-4">
                <h1 class="font-extrabold">Components</h1>
                <div class="buttons my-8">
                    <h2 class="pb-3">Buttons</h2>
                    <button is="c-button" class="btn-primary">Button primary</button>
                    <button is="c-button" class="btn-secondary ">Button secondary</button>
                    <button is="c-button" class="btn-default">Button default</button>
                    <button is="c-button">Button</button>
                    <button is="c-button" class="btn-secondary" disabled>Button disabled</button>
                </div>
                <div class="inputs my-8 " style="width: 500px">
                    <h2 class="pb-3">Inputs</h2>
                    
                    <div class="flex-col gap-4">
                        <input type="text" class="input-field" placeholder="Username or email"/>
                        <div class="form-group">
                            <label class="input-label">Input with label</label>
                            <input type="text" class="input-field" placeholder="Username or email"/>
                        </div>

                        <div class="form-group">
                            <input type="text" class="input-field error" placeholder="Username or email"/>
                            <span class="input-error text-xs ml-3 text-danger">This field is required</span>
                        </div>

                        <select class="select-field">
                            <option value="" disabled selected>Select an option</option>
                            <option value="1">Option 1</option>
                            <option value="2">Option 2</option>
                            <option value="3">Option 3</option>
                        </select>

                        <div class="form-group-inline">
                            <input type="text" class="input-field" placeholder="Username or email"/>
                            <input type="text" class="input-field" placeholder="Username or email"/>
                        </div>

                        <div class="form-group">
                                <input id="s2d" type="checkbox" class="switch" checked>

                            <span>
                                <input id="c1" type="checkbox">
                                <label for="c1">Checkbox</label>
                            </span>

                            <span>
                                <input id="r1" type="radio" name="radio" value="1">
                                <label for="r1">Radio</label>
                                <input id="r2" type="radio" name="radio" value="2" checked>
                                <label for="r2">Radio</label>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="confirm-modal my-8">
                    <h2 class="pb-3">Modal</h2>
                    <c-modal title="Delete record" subtitle="Are you sure you want to accept?"></c-modal>
                    <button class="btn-secondary" onclick="document.querySelector('c-modal').open()">Open modal</button>
                </div>
                <div class="toast-notification my-8">
                    <h2 class="pb-3">Toast</h2>
                    <button class="btn-default" id="notify">Success</button>
                    <button class="btn-default" id="notify1">Error</button>
                    <button class="btn-default" id="notify2">Warning</button>
                    <button class="btn-default" id="notify3">Info</button>
                </div>
                <div class="paddles my-8">
                    <h2 class="pb-3">Paddle Options</h2>
                    <form id="paddlesForm">
                        <div class="flex gap-2 mb-2">
                            <c-paddle-card type="fire" tooltip="Speed up your smashes" flow="right"></c-paddle-card>
                            <c-paddle-card type="basic" tooltip="Enlarge your paddle for 5sec" flow="up" checked></c-paddle-card>
                            <c-paddle-card type="ice" tooltip="Slow down your opponent" flow="right"></c-paddle-card>
                        </div>
                        <button class="btn-secondary">Submit</button>
                        <span id="selected-paddle"></span>
                    </form>
                </div>
                <div class="tables my-8">
                    <h2 class="pb-3">Table themes</h2>
                    <form id="themesForm">
                        <div class="flex gap-2 mb-2">
                            <c-table-theme type="classic"></c-table-theme>
                            <c-table-theme type="standard" checked></c-table-theme>
                            <c-table-theme type="football"></c-table-theme>
                        </div>
                        <button class="btn-secondary">Submit</button>
                        <span id="selected-theme"></span>
                    </form>
                </div>
                <div class="tournaments-card flex gap-3">
                    <c-tournament-card players="8"></c-tournament-card>
                    <c-tournament-card players="8"></c-tournament-card>
                    <c-tournament-card players="8"></c-tournament-card>
                </div>

                <div>
                    <c-leaderboard-table></c-leaderboard-table>
                </div>

                <div class="matchhistory">
                    <c-match-history></c-match-history>
                </div>

                <div>
                    <c-friendscard></c-friendscard>
                </div>

                <div class="dropdown-component">
                    <div class="dropdown-wrapper">
                        <button class="btn-primary dropdown-button"> 
                            Dropdown
                        </button>
                        <c-dropdown></c-dropdown>
                    </div>
                </div>
                
                <div class="skeleton-loading">
                    <c-loading-chat-card></c-loading-chat-card>
                </div>
                `;
	}
}

customElements.define("p-components", Components);
