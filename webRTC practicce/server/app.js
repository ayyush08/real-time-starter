import {
    Server
} from 'socket.io'

const socketPort = 8001
const io = new Server(socketPort)


io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);
    
})