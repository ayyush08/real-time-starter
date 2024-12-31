import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'
const Room = () => {
    const { socket } = useSocket()
    const {peer,createOffer} = usePeer()
    const handleNewUserJoined = useCallback(async(data)=>{
        const {emailId} = data
        console.log('User joined',emailId);
        const offer = await createOffer();
        socket.emit('call-user',{emailId,offer})
    },[createOffer,socket])

    const handleIncomingCall = useCallback((data)=>{
        console.log('Incoming call',data);
        
    },[socket])

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on('incoming-call',handleIncomingCall)

        return ()=>{
            socket.off('user-joined',handleNewUserJoined);
            socket.off('incoming-call',handleIncomingCall)
        }
    },[socket,handleNewUserJoined])

    return (
        <div className='room-container'
        >ROOM</div>
    )
}

export default Room