import { config } from "../../config.js";
import { chatState } from "../../state/chatState.js";
import { friendState } from "../../state/friendState.js";
import { userState } from "../../state/userState.js";

export default class Friendslist extends HTMLElement {
	constructor() {
		super();
	}

	connectedCallback() {
		this.render();
		this.unsubscribe = friendState.subscribe(() => {
			this.render();
		});
	}

	disconnectedCallback() {
		if (this.unsubscribe) this.unsubscribe();
	}

	render() {
		const friends = friendState.state.friends;
		let userCards = [];
		if (!friends || friends.length === 0) {
			userCards.push(/*html*/ `<p class="text-center text-stroke">No friends yet</p>`);
		} else {
			userCards = friendState.state.friends.slice(0, 6).map((friendshipObject) => {
				const friend = friendState.getFriend(friendshipObject);
				return /*html*/ `
            <c-usercard 
                user-id="${friend.id}"
                img="${config.backend_domain}${friend.avatar}" 
                username="${friend.username}" 
                status="${friend.status}"
            ></c-usercard>
        `;
			});

            if (friends.length > 6) {
				userCards.push(/*html*/ `
                    <div class="flex-col-center w-full">
                        <p class="font-bold text-stroke text-sm text-center">And ${friendsLength - 6}+ more</p>
                    </div>
                `);
			}
		}

		this.innerHTML = /*html*/ `
        <div class="grid ${
			friendState.state.loading || friendState.state.friends.length > 0 ? "grid-cols-4" : ""
		} grid-center gap-8 friends-list">
            ${
				friendState.state.loading
					? /*html*/ `
                <c-usercard-loading></c-usercard-loading>
                <c-usercard-loading></c-usercard-loading>
                <c-usercard-loading></c-usercard-loading>
                <c-usercard-loading></c-usercard-loading>
            `
					: userCards.join("")
			}
        </div> 
        `;
	}
}
