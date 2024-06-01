import HttpClient from "../http/httpClient";
import State from "./state"

class NotificationState extends State {
    constructor() {
        super({
            notification: {},
            loading: true,
        })
        this.httpClient = HttpClient.instance;
    }

    async createNotification(notification) {
        try {
            this.resetLoading();
            await this.httpClient.post('notifications/', notification);
            this.getNotifications();
        } catch (error) {
            console.error(error);
        }
    }

    async getNotifications() {
        try {
            this.resetLoading();
            const notifications = await this.httpClient.get('notifications/');
            this.setState({ notifications, loading: false });
        } catch (error) {
            this.setState({ notifications: [], loading: false });
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