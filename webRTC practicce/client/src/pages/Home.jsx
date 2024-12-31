import React from 'react'

const Home = () => {
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