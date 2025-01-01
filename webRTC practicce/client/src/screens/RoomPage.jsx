import React, { useCallback, useEffect, useState } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

const RoomPage = () => {

    const socket = useSocket();
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState()

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined the room`);
        setRemoteSocketId(id)
    }, [])

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        const offer = await peer.getOffer();
        socket.emit('call-user', {
            to: remoteSocketId,
            offer
        })
        setMyStream(stream)
    }, [remoteSocketId, socket])


    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        console.log('incoming call', from, offer);
        setRemoteSocketId(from)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setMyStream(stream)
        const answer = await peer.getAnswer(offer)
        socket.emit('call-received', { to: from, answer })
    }, [socket])

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream)
        }
    }, [myStream])
    const handleCallReceived = useCallback(
        ({ from, answer }) => {
            peer.setLocalDescription(answer)
            console.log('Call received from', from);
            sendStreams();
        }, [sendStreams])

    const handleNegotiationNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit('peer-negotiation-needed', {
            offer,
            to: remoteSocketId
        })
    }, [remoteSocketId, socket])

    const handleNegotiationRequest = useCallback(async ({ from, offer }) => {
        const answer = await peer.getAnswer(offer);
        socket.emit('peer-negotiated', {
            to: from,
            answer
        })
    }, [socket])


    const handleFinalNegotiation = useCallback(async ({ from, answer }) => {
        console.log('Final negotiation from', from);
        await peer.setLocalDescription(answer)
    }, [])

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegotiationNeeded)
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegotiationNeeded)
        }
    }, [handleNegotiationNeeded])

    useEffect(() => {
        peer.peer.addEventListener('track', async (ev) => {
            const remoteStream = ev.streams
            console.log('Tracks received', remoteStream[0]);

            setRemoteStream(remoteStream[0])
        })
        if (remoteStream) {
            console.log(remoteStream);

        }
    }, [])

    useEffect(() => {
        socket.on('user-joined', handleUserJoined)
        socket.on('incoming-call', handleIncomingCall)
        socket.on('call-accepted', handleCallReceived)
        socket.on('peer-negotiation-request', handleNegotiationRequest)
        socket.on('peer-negotiated-finally', handleFinalNegotiation)

        return () => {
            socket.off('user-joined', handleUserJoined)
            socket.off('incoming-call', handleIncomingCall)
            socket.off('call-accepted', handleCallReceived)
            socket.off('peer-negotiation-request', handleNegotiationRequest)
            socket.off('peer-negotiated-finally', handleFinalNegotiation)

        }
    }, [socket, handleUserJoined, handleIncomingCall, handleCallReceived, handleNegotiationRequest, handleFinalNegotiation])






    return (
        <div>
            <h1>ROOM</h1>
            <h4>{remoteSocketId ? `${remoteSocketId} is in room` : 'No one in room'}</h4>
            {
                myStream && <button
                    onClick={sendStreams}
                >Send Stream</button>
            }
            {
                remoteSocketId && <button onClick={handleCallUser} >Call</button>
            }
            {
                myStream && (
                    <>
                        <h1>My Stream</h1>
                        <ReactPlayer
                            height={'100px'}
                            width={'200px'}
                            playing
                            muted
                            url={myStream}
                        />
                    </>
                )
            }
            {
                remoteStream && (
                    <>
                        <h1>Their Stream</h1>
                        <ReactPlayer
                            height={250}
                            width={500}
                            playing
                            muted
                            url={remoteStream}
                        />
                    </>
                )
            }
        </div>
    )
}

export default RoomPage