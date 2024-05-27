export default class Chat extends HTMLElement {
	constructor() {
		super();
		document.title = "Chat | Blitzpong";
		this.isEmpty = window.location.href.match(/\/chat\/?$/);
	}

	async connectedCallback() {
		this.render();
	}

	disconnectedCallback() {}

	render() {
		this.innerHTML = /*html*/ `

        <div class='chat-page'>
            <c-chat-list></c-chat-list>
            <c-conversation></c-conversation>
            ${!this.isEmpty ? 
            /*html*/ `<c-chat-match-history></c-chat-match-history>` 
            : ""}
        </div>
        `;
	}
}

customElements.define("p-chat", Chat);
