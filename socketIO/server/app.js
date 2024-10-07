import express from 'express';
import { Server } from 'socket.io';
import {createServer} from 'http';

const app  = express();
const PORT = 3000;
const server = createServer(app);

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials : true
    }
});
app.get('/', (req, res) => {
    res.send('Hello World!');
})

io.on("connection",(socket)=>{
    console.log("User ID:",socket.id);
    // socket.broadcast.emit("welcome",`User ${socket.id} has joined the chat`);

    socket.on("message",(data)=>{
        console.log(data);
        
    })

    socket.on("disconnect",()=>{
        console.log(`User ${socket.id} has disconnected`);
    })
})


server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});