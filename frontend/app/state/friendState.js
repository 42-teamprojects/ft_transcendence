import HttpClient from "../http/httpClient.js";
import { chatState } from "./chatState.js";
import { notificationState } from "./notificationState.js";
import State from "./state.js";
import { userState } from "./userState.js";

class FriendState extends State {
	constructor() {
		super({
			friends: [],
			loading: true,
		});
        this.fetchedFriends = false;
		this.httpClient = HttpClient.instance;
	}

	async getFriends() {
        if (this.fetchedFriends) return this.state.friends;
		try {
			this.setState({ loading: true });
			const result = await this.httpClient.get(`friends/`);
			this.setState({ friends: result, loading: false });
            this.fetchedFriends = true;
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async addFriend(userId) {
		try {
			const result = await this.httpClient.post(`friends/`, { user2: userId });

			// Send notification to the recipient
			const notification = {
				type: "FAL",
				data: {
					type: "ADD",
					sender_id: userState.state.user.id,
					sender_name: userState.state.user.username,
				},
				recipient: userId,
			}

			await notificationState.sendNotification(notification);

			this.setState({ friends: [...this.state.friends, result] });
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async removeFriend(userId) {
		try {
			const friendshipObject = this.getFriendshipObject(userId);
			const result = await this.httpClient.delete(`friends/${friendshipObject.id}/`);
			const notification = {
				type: "FAL",
				data: {
					type: "REMOVE",
					sender_id: userState.state.user.id,
					sender_name: userState.state.user.username,
				},
				recipient: userId,
			}

			await notificationState.sendNotification(notification);

			this.setState({ friends: this.state.friends.filter((friendshipObject) => friendshipObject.user1.id !== userId && friendshipObject.user2.id !== userId) });
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async blockFriend(userId) {
		try {
			const friendshipObject = this.getFriendshipObject(userId);
			const result = await this.httpClient.post(`friends/block/${friendshipObject.id}/`);
			const notification = {
				type: "FAL",
				data: {
					type: "BLOCK",
					sender_id: userState.state.user.id,
					sender_name: userState.state.user.username,
				},
				recipient: userId,
			}

			await notificationState.sendNotification(notification);

			this.setState({ friends: this.state.friends.filter((friendshipObject) => friendshipObject.user1.id !== userId && friendshipObject.user2.id !== userId) });
			chatState.reset();
			chatState.getChats();
			return result;
		} catch (error) {
			console.error(error);
		}
	}

	async unblockFriend(userId) {
		try {
			const friendshipObject = this.getFriendshipObject(userId);
			const result = await this.httpClient.post(`friends/unblock/${friendshipObject.id}/`);
			const notification = {
				type: "FAL",
				data: {
					type: "UNBLOCK",
					sender_id: userState.state.user.id,
					sender_name: userState.state.user.username,
				},
				recipient: userId,
			}

			await notificationState.sendNotification(notification);
			this.setState({ friends: this.state.friends.filter((friendshipObject) => friendshipObject.user1.id !== userId && friendshipObject.user2.id !== userId) });
			return result;
		} catch (error) {
			console.error(error);
		}
	}



	getFriend(friendshipObject) {
		const friend = friendshipObject.user1.id === userState.state.user.id ? friendshipObject.user2 : friendshipObject.user1;
		return friend;
	}

	alreadyFriends(userId) {
		return this.state.friends.some((friendshipObject) => {
			return friendshipObject.user1.id === userId || friendshipObject.user2.id === userId;
		});
	}

	getFriendshipObject(userId) {
		return this.state.friends.find((friendshipObject) => {
			return friendshipObject.user1.id === userId || friendshipObject.user2.id === userId;
		});
	}

	updateFriend(field, value) {
		const friends = this.state.friends;
		friends[field] = value;
		this.setState({ friends });
	}

	reset() {
		this.setState({
			friends: [],
			loading: true,
		});
		this.fetchedFriends = false;
	}
}

export const friendState = new FriendState();