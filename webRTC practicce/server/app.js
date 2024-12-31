import express from 'express';
import { Server } from 'socket.io'


const app = express();
const port = 3000;
const socketPort = 3001;
const io = new Server({
    cors:true
}) //socket server

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const emailToSocketMap = new Map()



io.on('connection', (socket) => {
    console.log("New connection");
    socket.on('join-room', ({roomId, emailId}) => {
        console.log('User joined room', roomId,emailId);
        emailToSocketMap.set(emailId, socket.id)
        socket.join(roomId)
        socket.broadcast.to('user-joined', emailId)
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', emailId)
        })
    })
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})

io.listen(socketPort)