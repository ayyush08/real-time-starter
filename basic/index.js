const http = require('http');
const WebSocketServer = require("websocket").server;

let connection = null; // Global variable

const httpserver = http.createServer((req, res) => {
    console.log('Request received');
});

const websocket = new WebSocketServer({
    "httpServer": httpserver,
});

websocket.on("request", (request) => {
    connection = request.accept(null, request.origin);

    console.log('Connection accepted from origin:', request.origin);
    // console.log('Connection object:', connection); // Log the connection

    // Start sending messages every 3 seconds now that the connection is established
    sendevery3seconds();

    // WebSocket events
    connection.on("close", () => {
        console.log('WebSocket connection closed!');
    });

    connection.on("message", (message) => {
        console.log(`Received message: ${message.utf8Data}`);
        // connection.sendUTF('Hello! Message received.');
    });
});

// Function to send a message every 3 seconds
function sendevery3seconds() {
    if (connection && connection.connected) {
        connection.sendUTF(`Message ${Math.random() * 100}`); // Use sendUTF for sending text
    }
    setTimeout(sendevery3seconds, 3000);
}

httpserver.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
