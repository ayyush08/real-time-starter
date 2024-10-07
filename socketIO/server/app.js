import express from 'express';
import { Server } from 'socket.io';
import {createServer} from 'http';
const app  = express();
const PORT = 3000;
const server = createServer(app);

const io = new Server(server);
app.get('/', (req, res) => {
    res.send('Hello World!');
})

io.on("connection",(socket)=>{
    console.log('A user connected');
    console.log("ID:",socket.id);
})


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});