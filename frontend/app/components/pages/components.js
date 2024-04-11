import Toast from "../comps/toast.js";

export default class Components extends HTMLElement {
	constructor() {
		super();
		document.title = "Components";
	}

	connectedCallback() {
		this.render();
		const modal = this.querySelector("c-modal");

		modal.addEventListener("confirm", () => {
			console.log("Confirmed...");
		});

		modal.addEventListener("cancel", () => {
			console.log("Cancelled...");
		});

		document.getElementById("notify").addEventListener("click", () => {
			Toast.notify({ type: "success", message: "Your changes have been saved" });
		});
		document.getElementById("btn-test").addEventListener("click", () => {
			Toast.notify({ type: "danger", message: "Aye" });
		});
	}

	render() {
		this.innerHTML = /*html*/ `
            <div class="mx-8 my-4">
                <h1 class="font-extrabold">Components</h1>
                <div class="buttons my-8">
                    <h2 class="pb-3">Buttons</h2>
                    <button is="c-button" class="btn-primary" id="btn-test">Button primary</button>
                    <button is="c-button" class="btn-secondary">Button secondary</button>
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
                            <span class="input-error ml-3 text-danger">This is the error</span>
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
                                <input id="r2" type="radio" name="radio" value="2">
                                <label for="r2">Radio</label>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal my-8">
                    <h2 class="pb-3">Modal</h2>
                    <c-modal title="Delete record" subtitle="Are you sure you want to accept?"></c-modal>
                    <button class="btn-secondary" onclick="document.querySelector('c-modal').open()">Open modal</button>
                </div>
                <div class="toast-notification my-8">
                    <h2 class="pb-3">Toast</h2>
                    <button class="btn-secondary" id="notify">Notify</button>
                </div>
            </div>
        `;
	}
}
