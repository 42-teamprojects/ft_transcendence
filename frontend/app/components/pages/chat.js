export default class Chat extends HTMLElement {
	constructor() {
		super();
		document.title = "Chat | Blitzpong";
		this.isEmpty = window.location.href.match(/\/chat\/?$/);
	}

	connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `

        <div class='chat-page'>
            <c-chat-list></c-chat-list>
            ${
				!this.isEmpty
					? /*html*/ ` 
            <c-conversation></c-conversation>`
					: /*html*/ `
            <div class="conversation w-full vh-full">
                <div class="flex-center vh-full">
                <div class="flex-col-center gap-4">
                    <i class="fa-regular fa-comments text-6xl text-primary mb-5"></i>
                    <h1 class="text-xl font-medium">Select a conversation to start chatting</h1>
                    <h2 class="text-md font-normal text-stroke">Or find a friend and chat</h2>
                    <button class="btn-primary" onclick="document.querySelector('c-friends-search-modal').open()">Find friends</button>
                </div>
                </div>
            </div>
        `
			}
        </div>
        `;
	}
}

customElements.define("p-chat", Chat);
