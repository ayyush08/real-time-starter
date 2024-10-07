import { Container, Typography,TextField,Button } from '@mui/material';
import React, { useEffect,useState } from 'react'
import {io} from 'socket.io-client'
const App = () => {
  const socket = io("http://localhost:3000");

  const [message,setMessage] = useState("");

  const handleSubmit = (e)=>{
    e.preventDefault();
    socket.emit("message",message);
    setMessage("");
  }
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("Connected",socket.id);
    })

    socket.on("welcome",(data)=>{
      console.log(data);
    })
    return ()=>{
      socket.disconnect();
    }
  },[])
  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component='div' gutterBottom>
        Welcome to Socket.IO
      </Typography>
    <form onSubmit={handleSubmit}>
    <TextField
    value={message}
    onChange={(e)=>setMessage(e.target.value)}
    id='outlined-basic' label='Message' variant='outlined'/>
    <Button type='submit' variant='contained' color='primary'>Send</Button>
    </form>
    </Container>
  )
}

export default App
