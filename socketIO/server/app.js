import express from 'express';
import { Server } from 'socket.io';
import {createServer} from 'http';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';


const app  = express();
const secretKeyJwt = "jjankjnakjdnajndand"
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


app.get('/login',(req,res)=>{
    jwt.sign({
        _id: "kadkadkandknadknad"
    },secretKeyJwt)
    res.cookie("token",{
        httpOnly:true,
        secure:true,
        sameSite:"none"
    }).json({
        message:"Login Successful"
    })
})
//Middleware
io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,(err)=>{
        if(err) return next(err)
        const token = socket.request.cookies.token;
    if(!token) return next(new Error("Authentication Error"));
        
    next();
    })
})
io.on("connection",(socket)=>{
    console.log("User ID:",socket.id);
    // socket.broadcast.emit("welcome",`User ${socket.id} has joined the chat`);

    socket.on("message",(data)=>{
        console.log(socket.id," " , data);
        socket.to(data.room).emit("receive-message",data.message);//can use io too,no issues
    })


    socket.on("join-room",(room)=>{
        socket.join(room);
        console.log(`User ${socket.id} has joined room ${room}`);
    })

    socket.on("disconnect",()=>{
        console.log(`User ${socket.id} has disconnected`);
    })
})


server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});