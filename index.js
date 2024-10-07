const http = require('http');
const WebSocketServer = require("websocket").server;
let connection = null;
const httpserver = http.createServer((req, res) => {
    console.log('request received');
    
});

const websocket = new WebSocketServer({
    "httpServer": httpserver,
})

websocket.on(
    "request",
    request => {
        connection = request.accept(null,request.origin);
        connection.on("onopen", ()=> console.log('opened!'));
        connection.on("onclose", ()=> console.log('closed!'));
        connection.on("onmessage",(message)=> {
            console.log(`Received message ${message}`);
        })
    }
)
httpserver.listen(3000, () => {
    console.log('server is listening on port 3000');
})