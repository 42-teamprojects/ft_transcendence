export default class Dropdown extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.dropdownContent = this.querySelector(".dropdown-content");
		this.dropdownButton = this.parentElement.querySelector(".dropdown-button");

		this.dropdownButton.addEventListener("mouseleave", () => {
			this.dropdownContent.classList.remove("show-dropdown");
		});
		this.dropdownButton.addEventListener("mouseover", () => {
			this.dropdownContent.classList.add("show-dropdown");
		});

		this.dropdownContent.addEventListener("mouseover", () => {
			this.dropdownContent.classList.add("show-dropdown");
		});
		this.dropdownContent.addEventListener("mouseleave", () => {
			this.dropdownContent.classList.remove("show-dropdown");
		});
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `
            <div class="dropdown-content">
                <ul class="dropdown__menu">
                <li class="dropdown__item">
                    <i class="fa-solid fa-comment dropdown__icon"></i>
                    <span class="dropdown__name">Chat</span>
                </li>

                <li class="dropdown__item">
                    <i class="fa-solid fa-gamepad dropdown__icon"></i>
                    <span class="dropdown__name">Play</span>
                </li>

                <li class="dropdown__item">
                    <i class="fa-solid fa-xmark dropdown__icon"></i>
                    <span class="dropdown__name">Unfriend</span>
                </li>
                </ul>
            </div>
        `;
	}
}
