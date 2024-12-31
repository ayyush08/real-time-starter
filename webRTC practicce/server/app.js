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

const socketToEmailMap = new Map()

io.on('connection', (socket) => {
    console.log("New connection");
    socket.on('join-room', ({roomId, emailId}) => {
        console.log('User joined room', roomId,emailId);
        emailToSocketMap.set(emailId, socket.id)
        socketToEmailMap.set(socket.id,emailId)
        socket.join(roomId)
        socket.emit('joined-room',{
            roomId
        })
        socket.broadcast.to(roomId).emit('user-joined',{
            emailId
        })
    })

    socket.on('call-user',(data)=>{
        const {emailId,offer} = data;
        const from = socketToEmailMap.get(socket.id)
        const socketId = emailToSocketMap.get(emailId);
       if(socketId){ socket.to(socketId).emit('incoming-call',{
            from: from,
            offer
        })}else{
            console.log('User not found');
            
        }
    })
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})

io.listen(socketPort)