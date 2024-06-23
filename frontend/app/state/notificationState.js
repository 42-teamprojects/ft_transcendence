import HttpClient from "../http/httpClient.js";
import Router from "../router/router.js";
import WebSocketManager from "../socket/WebSocketManager.js";
import State from "./state.js"
import { userState } from "./userState.js";
import { config } from "../config.js";
import Toast from "../components/comps/toast.js";
import { messageState } from "./messageState.js";
import { friendState } from "./friendState.js";
import { chatState } from "./chatState.js";
import { onlineTournamentState } from "./onlineTournamentState.js";

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
            newStatus: false,
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
                if (!['NEW_STATUS', 'TOURNAMENT_UPDATE', 'MSG', 'PRQ'].includes(notification.type) 
                    && notification.recipient === userState.state.user.id 
                    && notification.data && !['REMOVE', 'BLOCK', 'UNBLOCK'].includes(notification.data.type)) {
                    this.setState({ notifications: [notification, ...this.state.notifications], loading: false });
                }
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
                    case "NEW_STATUS":
                        this.setState({ newStatus: true });
                        friendState.updateStatus(notification.user_id, notification.status);
                        break;
                    case "TOURNAMENT_UPDATE":
                        this.handleTournamentUpdates(notification);
                        break;
                    default:
                        break;
                }
            },
        {
            onOpen: () => {
                console.log(`WebSocket connection opened for id: ${this.socketId}`);
                this.notificationSocket.send(this.socketId, {
                    type: "NEW_STATUS",
                    status: 'ON'
                });
            },
        }
        );
        window.addEventListener("beforeunload", () => {
            this.closeSocket();
        });
    }

    handleMessageNotification(notification) {
        if (!Router.instance.currentRouteStartsWith("/dashboard/chat")){
            Toast.notify({
                type: "info",
                message: /*html*/ `<p>You got message from  ${notification.data.sender_name}</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="/dashboard/chat/${notification.data.chat_id}" class="mt-2">View chat</a>`,
            });
        }
        if (!messageState.state.messages[notification.data.chat_id]) {
            messageState.getMessages(notification.data.chat_id);
        } 
    }

    handleFriendAlertNotification(notification) {
        // ${notification.data.sender_name} added you as a friend
        if (notification.data.type === "ADD") {
            Toast.notify({
                type: "info",
                message: /*html*/ `<p>${notification.data.sender_name} added you as a friend</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="/dashboard/profile?username=${notification.data.sender_name}" class="mt-2">View friend</a>`,
            });
        }
        
        friendState.reset();
        friendState.getFriends();
        if (["BLOCK", "UNBLOCK"].includes(notification.data.type)) {
            friendState.getBlocked();
            chatState.reset();
            chatState.getChats();
        }
    }

    handlePlayRequestNotification(notification) {
        Toast.notify({
            type: "info",
            message: /*html*/ `<p>${notification.data.sender_name} sent you a play request</p><br/><a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" href="${notification.data.link}" class="mt-2">Play</a>`,
        });
    }

    handleTournamentNotification(notification) {
        if (notification.data.type === 'MATCH_STARTED') {
            const { tournament_id, match_id, message } = notification.data
            Toast.notify({
                type: "info",
                message: /*html*/ `
                    <p>${message}</p>
                    <br/>
                    <a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" 
                    href="/online/tournament?tournamentId=${tournament_id}&matchId=${match_id}">Play</a>`,
            });
        }
        else {
            Toast.notify({
                type: "info",
                message: notification.data.message,
            });
        }
    }

    handleTournamentUpdates(notification) {
        if (notification.data.type === 'MATCH_STARTED') {
            const { tournament_id, match_id, message } = notification.data
            Toast.notify({
                type: "info",
                message: /*html*/ `
                    <p>${message}</p>
                    <br/>
                    <a is="c-link" class="font-bold spacing-1 uppercase text-secondary mt-2 text-sm" 
                    href="/online/tournament?tournamentId=${tournament_id}&matchId=${match_id}">Play</a>`,
            });
        }
        else if (notification.data.type === 'TOURNAMENT_CREATED') {
            Toast.notify({
                type: "info",
                message: notification.data.message,
            });
        }
        else if (notification.data.type === 'TOURNAMENT_CANCELLED') {
            Toast.notify({
                type: "info",
                message: notification.data.message,
            });
        }
        onlineTournamentState.getNotStartedTournaments();
        // onlineTournamentState.getInProgressTournaments();
        // onlineTournamentState.getMyInProgressMatch();
    }

    /* 
    Notification: 
        - type
        - data
        - recipient
        - read -> default false
    */
    async sendNotification(notification, updateState = true, saveInDatabase = true) {
        try {
            this.resetLoading();
            if (saveInDatabase && !["REMOVE", "BLOCK", "UNBLOCK"].includes(notification.data.type) && notification.type !== "MSG" && notification.type !== "PRQ") {
                const notif = await this.httpClient.post('notifications/', notification);
                notification.id = notif.id;
            }
            // Send notification to the socket
            this.notificationSocket.send(this.socketId, notification);
        } catch (error) {
            console.error(error);
        }
    }

    async getNotifications() {
        if (this.notificationsFetched) return this.state.getNotifications;
        try {
            this.resetLoading();
            const notifications = await this.httpClient.get('notifications/unread/');
            this.setState({ notifications, loading: false });
            this.notificationsFetched = true;
            return this.state.notifications
        } catch (error) {
            this.setState({ loading: false });
            console.error(error);
        }
    }
    
    async getNotificationsAll() {
        if (this.notificationsFetched) return this.state.getNotifications;
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
        try {
            this.resetLoading();
            await this.httpClient.post('notifications/mark_all_read/');
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

    closeSocket() {
        this.setState({ newStatus: true });
        this.notificationSocket.send(this.socketId, {
            type: "NEW_STATUS",
            status: 'OF'
        });
        this.notificationSocket.closeConnection(this.socketId);
    }

    reset() {
        this.setState({
            notifications: [],
            loading: true,
        });
    }
}

export const notificationState = new NotificationState();