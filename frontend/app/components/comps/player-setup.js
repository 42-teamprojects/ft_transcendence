import LocalPlayer from "../../entities/LocalPlayer.js";
import { useFormData } from "../../utils/useForm.js";
import { isThere } from "../../utils/utils.js";

export default class Playersetup extends HTMLElement {
	constructor() {
		super();
		this.playerId = parseInt(this.getAttribute("player-id")) || null;
		this.isTournament = isThere(["true", ""], this.getAttribute("tournament"), false);
		this.isDisabled = this.hasAttribute("disabled");
		this.classStyle;
		this.aliasInput;
		this.btnReady;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (this.hasAttribute("disabled")) {
			this.isDisabled = true;
		}
		if (name === "player-id") {
			this.playerId = parseInt(newValue);
			this.classStyle = this.playerId % 2 === 0 ? "primary" : "secondary";
		}
		if (name === "tournament") {
			this.isTournament = isThere(["true", ""], newValue, false);
		}
	}

	static get observedAttributes() {
		return ["player-id", "tournament", "disabled"];
	}

	connectedCallback() {
		this.render();
		this.aliasInput = this.querySelector("input[name=alias]");
		this.btnReady = this.querySelector(".btn-ready");

		if (this.isTournament) this.btnReady.classList.add("hidden");

		this.aliasInput.addEventListener("change", this.aliasFieldHandler.bind(this));
		this.querySelector("form").addEventListener("submit", this.readyHandler.bind(this));
	}

	readyHandler(e) {
		e.preventDefault();
		const formData = useFormData(e.target).getObject();
		const alias = formData["alias"];
		const paddle = formData["paddle-option"];
		if (!this.checkAlias(alias, this.aliasInput)) return;

		if (this.isTournament == false) {
			this.btnReady.disabled = true;
			this.btnReady.textContent = "Waiting...";
		}

		const player = new LocalPlayer(this.playerId, alias, paddle);

		this.dispatchEvent(
			new CustomEvent("player-ready", {
				detail: { player: player },
			})
		);
		this.disableSetup();
	}

	aliasFieldHandler(e) {
		const alias = e.target.value;
		this.checkAlias(alias, e.target);
	}

	render() {
		this.innerHTML = /*html*/ `
        <div class="player-setup ${this.isTournament ? "flex-col-center my-4" : "flex-col"} px-4">
            <h2 class="text-${this.classStyle} mb-6 text-center">Player ${
			this.playerId
		}</h2>
            <div style="width: 285px">
                <form class="flex-col-center gap-5">
                    <div class="form-group w-full">
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

	disconnectedCallback() {
		this.aliasInput.removeEventListener("change", this.aliasFieldHandler);
		this.querySelector("form").removeEventListener("submit", this.readyHandler);
	}

	checkAlias(alias, e) {
		const errorMsg = this.querySelector(".input-error");
		let taken = false;
		if (this.isTournament) {
			taken = document.querySelector("c-add-players")?.players.some((player) => player.alias === alias);
		} else {
			taken = document.querySelector("p-one-vs-one").players.some((player) => player.alias === alias);
		}
		if (taken) {
			e.classList.add("error");
			errorMsg.textContent = "Alias already taken";
			errorMsg.classList.remove("hidden");
			return false;
		}
		if (alias.length < 3 || alias.length > 20) {
			e.classList.add("error");
			errorMsg.textContent = "Must be 3-20 characters";
			errorMsg.classList.remove("hidden");
			return false;
		} else {
			e.classList.remove("error");
			errorMsg.classList.add("hidden");
			return true;
		}
	}

	submitForm() {
		this.btnReady.click();
	}

	disable() {
		return (this.isDisabled) && 'disabled';
	}
s
    disableSetup() {
        this.aliasInput.disabled = true;
        this.querySelectorAll("c-paddle-card").forEach((paddleCard) => {
            paddleCard.setAttribute("disabled", "true");
            paddleCard.removeAttribute("tooltip");
        });
    }

	readyForShowcase() {
		this.disableSetup();
		this.querySelector("h2").classList.add("hidden");
		this.querySelector("h3").classList.add("hidden");
	}
}
