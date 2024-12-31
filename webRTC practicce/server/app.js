import express from 'express';
import {Server} from 'socket.io'


const app = express();
const port = 3000;
const socketPort = 3001;
const io = new Server() //socket server

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});


io.on('connection',(socket)={
    
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})

io.listen(socketPort)