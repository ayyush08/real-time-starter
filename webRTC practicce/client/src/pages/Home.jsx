import React from 'react'
import { useSocket } from '../providers/Socket'

const Home = () => {
    const {socket} = useSocket()
    socket.emit('join-room',{
        roomId: '1',
        emailId:'jnad@mad.com'
    })
    return (
        <div className='homepage-container'>
            <div className="input-container">
                <input type="email"
                placeholder='Enter email' />
                <input type="text"
                placeholder='Enter room code' />
                <button>Enter room</button>
            </div>
        </div>
    )
}

export default Home