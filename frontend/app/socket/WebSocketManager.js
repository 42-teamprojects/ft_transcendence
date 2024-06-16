export default class WebSocketManager {
    constructor(socketUrl) {
        this.socketUrl = socketUrl;
        this.sockets = {};
        this.messageQueues = {};
        this.lastUseTimes = {};
        this.retryCounts = {};
    }

    setupWebSocket(id, onMessage, options = {}) {
        const {
            onErrorCallback = () => {},
            shouldCloseOnTimeout = false,
            timeoutDuration = 5 * 60 * 1000,
            onOpen = () => {
                console.log(`WebSocket connection opened for id: ${id}`);
                // Send all queued messages
                while (this.messageQueues[id] && this.messageQueues[id].length > 0) {
                    this.sockets[id].send(this.messageQueues[id].shift());
                }
            },
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
        this.messageQueues[id] = []; // Initialize message queue
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
        delete this.messageQueues[id]; // Clear the message queue
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

        const message = JSON.stringify(data);

        if (this.sockets[id].readyState === WebSocket.OPEN) {
            this.sockets[id].send(message);
            this.lastUseTimes[id] = Date.now();
        } else if (this.sockets[id].readyState === WebSocket.CONNECTING) {
            console.log(`WebSocket is in CONNECTING state for id: ${id}. Queueing message.`);
            this.messageQueues[id].push(message);

            // Adding an event listener to handle the case where the WebSocket transitions to OPEN state
            this.sockets[id].addEventListener('open', () => {
                while (this.messageQueues[id] && this.messageQueues[id].length > 0) {
                    this.sockets[id].send(this.messageQueues[id].shift());
                }
            }, { once: true });
        } else {
            console.error(`WebSocket connection for id: ${id} is not open and not connecting. Message not sent.`);
        }
    }
}
