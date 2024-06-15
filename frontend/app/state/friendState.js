import Toast from "../components/comps/toast.js";
import HttpClient from "../http/httpClient.js";
import Router from "../router/router.js";
import { chatState } from "./chatState.js";
import { notificationState } from "./notificationState.js";
import State from "./state.js";
import { userState } from "./userState.js";

class FriendState extends State {
	constructor() {
		super({
			friends: [],
			blocked: [],
			loading: true,
		});
        this.fetchedFriends = false;
		this.httpClient = HttpClient.instance;
	}

	async getFriends(force = false) {
        if (!force && this.fetchedFriends) return this.state.friends;
		try {
			this.setState({ loading: true });
			const result = await this.httpClient.get(`friends/`);
			this.setState({ friends: result, loading: false });
            this.fetchedFriends = true;
			return result;
		} catch (error) {
			console.error(error);
			Toast.notify({ message: "An error occurred", type: "error" });
		}
	}

	async getBlocked() {
		try {
			this.setState({ loading: true });
			const result = await this.httpClient.get(`friends/blocked/`);
			this.setState({ blocked: result, loading: false });
			return result;
		} catch (error) {
			console.error(error);
			Toast.notify({ message: "An error occurred", type: "error" });
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
					username: userState.state.user.username,
					sender_id: userState.state.user.id,
					sender_name: userState.state.user.username,
					sender_avatar: userState.state.user.avatar,
				},
				recipient: userId,
			}

			await notificationState.sendNotification(notification);

			this.setState({ friends: [...this.state.friends, result] });
			return result;
		} catch (error) {
			console.error(error);
			Toast.notify({ message: "An error occurred", type: "error" });
		}
	}

	async removeFriend(userId) {
		try {
			const friendshipObject = this.getFriendshipObject(userId);
			if (!friendshipObject) return;
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
			await notificationState.sendNotification(notification, false);
			Router.instance.navigate("/dashboard/profile");
			this.setState({ friends: this.state.friends.filter((friendshipObject) => friendshipObject.user1.id !== userId && friendshipObject.user2.id !== userId) });
			return result;
		} catch (error) {
			console.error(error);
			Toast.notify({ message: "An error occurred", type: "error" });
		}
	}

	async blockFriend(userId) {
		try {
			const friendshipObject = this.getFriendshipObject(userId);
			if (!friendshipObject) return;
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

			await notificationState.sendNotification(notification, false);

			this.setState({ friends: this.state.friends.filter((friendshipObject) => friendshipObject.user1.id !== userId && friendshipObject.user2.id !== userId) });
			this.setState({ blocked: [...this.state.blocked, friendshipObject] });
			chatState.reset();
			chatState.getChats();
			return result;
		} catch (error) {
			console.error(error);
			Toast.notify({ message: "An error occurred", type: "error" });
		}
	}

	async unblockFriend(userId) {
		try {
			const friendshipObject = this.getFriendshipObject(+userId, true);
			if (!friendshipObject) return;
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
			this.getBlocked();
			this.setState({ friends: [...this.state.friends, friendshipObject] });
			// this.setState({ blocked: this.state.blocked.filter((friendshipObject) => friendshipObject.user1.id !== userId && friendshipObject.user2.id !== userId) });
			return result;
		} catch (error) {
			console.error(error);
			Toast.notify({ message: "An error occurred", type: "error" });
		}
	}



	getFriend(friendshipObject) {
		const friend = friendshipObject.user1.id === userState.state.user.id ? friendshipObject.user2 : friendshipObject.user1;
		return friend;
	}

	alreadyFriends(userId) {
		if (!userId) return false;
		return this.state.friends.some((friendshipObject) => {
			return friendshipObject.user1.id === userId || friendshipObject.user2.id === userId;
		});
	}

	getFriendshipObject(userId, blocked = false) {
		if (blocked) {
			return this.state.blocked.find((friendshipObject) => {
				return friendshipObject.user1.id === userId || friendshipObject.user2.id === userId;
			});
		}
		return this.state.friends.find((friendshipObject) => {
			return friendshipObject.user1.id === userId || friendshipObject.user2.id === userId;
		});
	}

	updateStatus(friendId, status) {
		const friends = this.state.friends;
		if (friends.length === 0) return;
		const friendShip = friends.find((friend) => +friend.user1.id === +friendId || +friend.user2.id === +friendId);
		if (!friendShip) return;
		const friend = this.getFriend(friendShip);
		if (friend) {
			friend.status = status;
			this.setState({ friends: friends });
		}
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
