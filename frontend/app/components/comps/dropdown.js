export default class Dropdown extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.dropdownContent = this.querySelector(".dropdown-content");
		this.dropdownButton = this.parentNode.querySelector(".dropdown-button");

		this.dropdownButton.addEventListener("click", () => {
			this.dropdownContent.classList.toggle("show-dropdown");
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
                    <i class="fa-solid fa-user dropdown__icon"></i>
                    <span class="dropdown__name">Messages</span>
                </li>

                <li class="dropdown__item">
                    <i class="fa-solid fa-user dropdown__icon"></i>
                    <span class="dropdown__name">Accounts</span>
                </li>

                <li class="dropdown__item">
                    <i class="fa-solid fa-user dropdown__icon"></i>
                    <span class="dropdown__name">Settings</span>
                </li>
                </ul>
            </div>
        `;
	}
}
