import {
    Server
} from 'socket.io'

const socketPort = 8001
const io = new Server(socketPort,{
    cors:true
})


const emailToSocketIdMap = new Map()
const socketIdToEmailMap  = new Map()

io.on('connection',(socket)=>{
    console.log('socket connected',socket.id);
    socket.on('join-room',(data)=>{
        const {email,room} = data;
        emailToSocketIdMap.set(email,socket.id)
        socketIdToEmailMap.set(socket.id,email);
        io.to(room).emit('user-joined',{email,id:socket.id})
        socket.join(room)
        io.to(socket.id).emit('join-room',data)
    })

    socket.on('call-user',({to,offer})=>{
        io.to(to).emit('incoming-call',{
            from:socket.id,
            offer
        })
    })

})