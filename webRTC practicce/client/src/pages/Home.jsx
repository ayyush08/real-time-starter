import React, { useState,useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { useSocket } from '../providers/Socket'

const Home = () => {
    const {socket} = useSocket()
    const navigate = useNavigate()
    const [email,setEmail] = useState();
    const [roomId,setRoomId] = useState()

    const handleJoinedRoom = ({roomId})=>{
        console.log('room joined',roomId);
        navigate(`/room/${roomId}`)
    }


    useEffect(()=>{
        socket.on('joined-room',handleJoinedRoom)
    },[socket])



    const handleJoinRoom = ()=>{
        socket.emit('join-room',{
            emailId:email,
            roomId
        })
    }
    return (
        <div className='homepage-container'>
            <div className="input-container">
                <input
                value={email}
                onChange={e=>setEmail(e.target.value)}
                type="email"
                placeholder='Enter email' />
                <input
                value={roomId}
                onChange={e=>setRoomId(e.target.value)}
                type="text"
                placeholder='Enter room code' />
                <button
                onClick={()=>handleJoinRoom()}
                >Enter room</button>
            </div>
        </div>
    )
}

export default Home