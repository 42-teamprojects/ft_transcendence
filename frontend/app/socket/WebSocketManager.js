export default class WebSocketManager {
    constructor(socketUrl) {
        this.socketUrl = socketUrl;
        this.sockets = {};
        this.lastUseTimes = {};
        this.retryCounts = {};
    }

    setupWebSocket(id, onMessage, options = {}) {
        const {
            onErrorCallback = () => {},
            shouldCloseOnTimeout = false,
            timeoutDuration = 5 * 60 * 1000,
            onOpen = () => console.log(`WebSocket connection opened for id: ${id}`),
            onClose = () => console.log(`WebSocket connection closed for id: ${id}`),
            onError = (error) => {
                console.error(`WebSocket error for id: ${id}`, error);
                if (!this.retryCounts[id]) {
                    this.retryCounts[id] = 0;
                }
                if (this.retryCounts[id] < 3) {
                    this.retryCounts[id]++;
                    console.log(`Retrying connection for id: ${id}. Attempt number: ${this.retryCounts[id]}`);
                    this.closeConnection(id);
                    this.setupWebSocket(id, onMessage, options);
                    onErrorCallback();
                } else {
                    console.log(`Failed to establish connection for id: ${id} after 3 attempts. Closing connection.`);
                    this.closeConnection(id);
                }
            },
        } = options;

        
        if (this.sockets[id]) return;
       
        this.sockets[id] = new WebSocket(`${this.socketUrl}${id}/`);
        this.sockets[id].onmessage = onMessage;
        this.sockets[id].onopen = onOpen;
        this.sockets[id].onclose = onClose;
        this.sockets[id].onerror = onError;

        this.lastUseTimes[id] = Date.now();

        if (shouldCloseOnTimeout) {
            setInterval(() => this.closeUnusedConnections(timeoutDuration), timeoutDuration);
        }
    }

    closeConnection(id) {
        if (!this.sockets[id]) return;
        this.sockets[id].close();
        delete this.sockets[id];
        delete this.lastUseTimes[id];
    }

    closeUnusedConnections(timeout = 5 * 60 * 1000) {
        const now = Date.now();

        for (const id in this.sockets) {
            if (now - this.lastUseTimes[id] > timeout) {
                this.closeConnection(id);
            }
        }
    }

    send(id, data) {
        if (!this.sockets[id]) {
            console.error(`WebSocket connection with id: ${id} does not exist`);
            return;
        }
        this.sockets[id].send(JSON.stringify(data));
        this.lastUseTimes[id] = Date.now();
    }
}