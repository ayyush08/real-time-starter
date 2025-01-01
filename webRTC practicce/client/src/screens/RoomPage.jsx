import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
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
        setMyStream(stream)
    },[])
    useEffect(() => { 
        socket.on('user-joined',handleUserJoined)

        return ()=>{
            socket.off('user-joined',handleUserJoined)
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