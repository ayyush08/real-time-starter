import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

const RoomPage = () => {

    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId] = useState(null);
    const [myStream,setMyStream] = useState(null);

    const handleUserJoined = useCallback(({email,id})=>{
        console.log(`Email ${email} joined the room`);
        setRemoteSocketId(id)
    },[])

    const handleCallUser = useCallback(async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
        const offer = await peer.getOffer();
        socket.emit('call-user',{
            to: remoteSocketId,
            offer
        })
        setMyStream(stream)
    },[remoteSocketId,socket])


    const handleIncomingCall = useCallback(async({from,offer})=>{
        console.log('incoming call',from,offer);
        setRemoteSocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio:true,
            video:true
        })
        setMyStream(stream)
        const answer = await peer.getAnswer(offer)
        socket.emit('call-received',{to:from,answer})
    },[socket])


    const handleCallReceived = useCallback(({from,answer})=>{
        peer.setLocalDescription(answer)
        console.log('Call received from',from);
        
    },[])

    useEffect(() => { 
        socket.on('user-joined',handleUserJoined)
        socket.on('incoming-call',handleIncomingCall)
        socket.on('call-accepted',handleCallReceived)
        return ()=>{
            socket.off('user-joined',handleUserJoined)
            socket.off('incoming-call',handleIncomingCall)
            socket.off('call-accepted',handleCallReceived)
        }
    }, [socket,handleUserJoined])


    return (
        <div>
            <h1>ROOM</h1>
            <h4>{remoteSocketId ? `${remoteSocketId} is in room`:'No one in room'}</h4>
            {
                remoteSocketId && <button onClick={handleCallUser} >Call</button>
            }
            {
                myStream && (
                <>
                <h1>My Stream</h1>
                <ReactPlayer
                height={250}
                width={500}
                playing
                muted
                url={myStream}
                />
                </>
                )
            }
        </div>
    )
}

export default RoomPage