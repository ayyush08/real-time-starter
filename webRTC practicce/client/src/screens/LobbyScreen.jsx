import React, { useState, useCallback, useEffect } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {
    const [email, setEmail] = useState("");
    const [room, setRoom] = useState("");

    const navigate = useNavigate()

    const socket = useSocket()

    const handleSubmitForm = useCallback((e)=>{
        e.preventDefault();
        console.log({email,room});
        socket.emit('join-room',{email,room})
    },[email,room,socket])
    

    const handleJoinRoom = useCallback((data)=>{
        const {email,room} = data
        console.log("join room handler",email,room);
        navigate(`room/${room}`)
    },[])


    useEffect(()=>{
        socket.on('join-room',handleJoinRoom)
        return ()=>{
            socket.off('join-room',handleJoinRoom)
        }
    },[])

    return (
        <div>
            <h1>Lobby</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor="email">Email ID</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <label htmlFor="room">Room Number</label>
                <input
                    type="text"
                    id="room"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                />
                <br />
                <button>Join</button>
            </form>
        </div>
    );
};

export default LobbyScreen;