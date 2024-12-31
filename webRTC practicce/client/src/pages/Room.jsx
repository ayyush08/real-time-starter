import React, { useEffect } from 'react'
import { useSocket } from '../providers/Socket'
const Room = () => {
    const { socket } = useSocket()

    const handleNewUserJoined = (data)=>{
        const {emailId} = data
        console.log('User joined',emailId);
        
    }

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
    },[socket])

    return (
        <div className='room-container'
        >ROOM</div>
    )
}

export default Room