import HttpClient from "../http/httpClient.js";
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
	}
}

export const friendState = new FriendState();
