import React, { createContext,useMemo } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext(null)




export const SocketProvider = ({children})=>{
    const socket = useMemo(()=>io({
        host:'localhost',
        port:3001
    }))
    return(
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}