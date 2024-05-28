class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.onOpenCallback = null;
        this.onCloseCallback = null;
        this.onErrorCallback = null;
        this.onMessageCallback = null;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = (event) => {
            if (this.onOpenCallback) {
                this.onOpenCallback(event);
            }
        };

        this.socket.onclose = (event) => {
            if (this.onCloseCallback) {
                this.onCloseCallback(event);
            }
        };

        this.socket.onerror = (event) => {
            if (this.onErrorCallback) {
                this.onErrorCallback(event);
            }
        };

        this.socket.onmessage = (event) => {
            if (this.onMessageCallback) {
                this.onMessageCallback(event);
            }
        };
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('WebSocket is not open. Ready state:', this.socket.readyState);
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    onOpen(callback) {
        this.onOpenCallback = callback;
    }

    onClose(callback) {
        this.onCloseCallback = callback;
    }

    onError(callback) {
        this.onErrorCallback = callback;
    }

    onMessage(callback) {
        this.onMessageCallback = callback;
    }
}

export default WebSocketClient;