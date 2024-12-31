import React, { useCallback, useEffect } from 'react'
import { useSocket } from '../providers/Socket'
import { usePeer } from '../providers/Peer'
const Room = () => {
    const { socket } = useSocket()
    const {peer,createOffer,createAnswer,setRemoteAnswer} = usePeer()
    const handleNewUserJoined = useCallback(async(data)=>{
        const {emailId} = data
        console.log('User joined',emailId);
        const offer = await createOffer();
        socket.emit('call-user',{emailId,offer})
    },[createOffer,socket])

    const handleIncomingCall = useCallback(async(data)=>{

        const {from,offer} = data
        console.log('Incoming call',data);
        const answer = await createAnswer(offer)
        socket.emit('call-received',{
            emailId: from,
            answer
        })
    },[socket,createAnswer])


    const handleCallAccepted = useCallback(async(data)=>{
        const {from,answer} = data
        await setRemoteAnswer(answer)
        console.log('Call accepted',from,answer);
        
    },[setRemoteAnswer])

    useEffect(()=>{
        socket.on('user-joined',handleNewUserJoined)
        socket.on('incoming-call',handleIncomingCall)
        socket.on('call-accepted',handleCallAccepted)

        return ()=>{
            socket.off('user-joined',handleNewUserJoined);
            socket.off('incoming-call',handleIncomingCall)
            socket.off('call-accepted',handleCallAccepted)
        }
    },[socket,handleNewUserJoined])

    return (
        <div className='room-container'
        >ROOM</div>
    )
}

export default Room