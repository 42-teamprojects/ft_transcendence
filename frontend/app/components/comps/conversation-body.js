export default class Conversationbody extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCallback() {}

    render() {
        this.innerHTML = /*html*/`
        <div class="conversation-body">
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out" message="sf thala"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="out"></c-message-bubble>
            <c-message-bubble type="in"></c-message-bubble>
            <c-message-bubble type="in" message="mshi thfaka"></c-message-bubble>
            </div>
        `;
    }
}
