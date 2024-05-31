export default class WebSocketManager {
    constructor(socketUrl) {
        this.socketUrl = socketUrl;
        this.sockets = {};
        this.lastUseTimes = {};
    }

    setupWebSocket(id, onMessage, options = {}) {
        const {
            shouldCloseOnTimeout = false,
            timeoutDuration = 5 * 60 * 1000,
            onOpen = () => console.log(`WebSocket connection opened for id: ${id}`),
            onClose = () => console.log(`WebSocket connection closed for id: ${id}`),
            onError = (error) => console.error(`WebSocket error for id: ${id}`, error),
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