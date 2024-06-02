import HttpClient from "../http/httpClient.js";
import Router from "../router/router.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import State from "./state.js"
import { userState } from "./userState.js";
import { config } from "../config.js";
import Toast from "../components/comps/toast.js";
import { truncate } from "../utils/utils.js";
import { messageState } from "./messageState.js";
import { friendState } from "./friendState.js";
import { chatState } from "./chatState.js";

/* 
    Notification: 
        - type
        - data
        - recipient
        - read -> default false
    */

class NotificationState extends State {
    constructor() {
        super({
            notifications: [],
            loading: true,
        })
        this.httpClient = HttpClient.instance;
		this.notificationSocket = new WebSocketManager(config.websocket_url);
		this.socketId = 'notifications/';
        this.notificationsFetched = false;
    }

    async setup() {
        await this.getNotifications();
        this.socketId = "notifications/" + userState.state.user.id;
        //check if the socket is already open
        if (this.notificationSocket.sockets[this.socketId]) return;
        //setup the websocket connection
        this.notificationSocket.setupWebSocket(
            this.socketId,
            //on message callback
            (event) => {
                const notification = JSON.parse(event.data);
                this.setState({ notifications: [notification, ...this.state.notifications] ,loading: false });
                switch (notification.type) {
                    case "MSG":
                        this.handleMessageNotification(notification);
                        break;
                    case "TRN":
                        this.handleTournamentNotification(notification);
                        break;
                    case "PRQ":
                        this.handlePlayRequestNotification(notification);
                        break;
                    case "FAL":
                        this.handleFriendAlertNotification(notification);
                        break;
                    default:
                        break;
            }
        }
        );
    }

    handleMessageNotification(notification) {
        if (!Router.instance.currentRouteStartsWith("/dashboard/chat")){
            Toast.notify({
                type: "info",
                message: /*html*/ `<p>You got message from  ${notification.data.sender_name}</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="/dashboard/chat/${notification.data.chat_id}" class="mt-2">View chat</a>`,
            });
        }
        messageState.updateCardLastMessage(notification.data.chat_id, notification.data.message);
    }

    handleFriendAlertNotification(notification) {
        const message = notification.data.type === "ADD" ? `${notification.data.sender_name} added you as a friend` : ``;
        if (notification.data.type === "ADD") {
            Toast.notify({
                type: "info",
                message: /*html*/ `<p>${message}</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="/dashboard/profile?username=${notification.data.sender_name}" class="mt-2">View friend</a>`,
            });
        }
        
        friendState.reset();
        friendState.getFriends();
        friendState.blockFriend();
        chatState.reset();
        chatState.getChats();
    }

    /* 
    Notification: 
        - type
        - data
        - recipient
        - read -> default false
    */
    async sendNotification(notification) {
        try {
            this.resetLoading();
            await this.httpClient.post('notifications/', notification);

            // Send notification to the socket
            this.notificationSocket.send(this.socketId, notification);
            this.setState({ notifications: [notification, ...this.state.notifications] ,loading: false });
        } catch (error) {
            console.error(error);
        }
    }

    async getNotifications() {
        if (this.notificationsFetched) {
            // return unread notifications
            return this.state.getNotifications
        }
        try {
            this.resetLoading();
            const notifications = await this.httpClient.get('notifications/');
            this.setState({ notifications, loading: false });
            this.notificationsFetched = true;
            return this.state.notifications
        } catch (error) {
            this.setState({ loading: false });
            console.error(error);
        }
    }

    async markAllAsRead() {
        console.log("marking all as read");
        try {
            this.resetLoading();
            await this.httpClient.put('notifications/mark_as_read/', { read: true });
            const notifications = this.state.notifications.map((n) => {
                n.read = true;
                return n;
            });
            this.setState({ notifications, loading: false });
        } catch (error) {
            console.error(error);
        }
    }

    async markAsRead(notificationId) {
        try {
            this.resetLoading();
            await this.httpClient.put(`notifications/${notificationId}/`, { read: true });
            const notifications = this.state.notifications.map((n) => {
                if (n.id === notificationId) {
                    n.read = true;
                }
                return n;
            });
            this.setState({ notifications, loading: false });
        } catch (error) {
            console.error(error);
        }
    }

    resetLoading() {
        this.setState({ loading: true });
    }

    reset() {
        this.setState({
            notifications: [],
            loading: true,
        });
    }
}

export const notificationState = new NotificationState();