import React, { createContext, useContext, useMemo } from 'react'

const PeerContext = createContext(null)

export const usePeer = ()=>{
    return useContext(PeerContext)
}



export const PeerProvider =  (props)=>{
    const peer = useMemo(()=>(
        new RTCPeerConnection()
    ),[])

    const createOffer = async()=>{
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer)
        return offer
    }

    return (
        <PeerContext.Provider value={{peer,createOffer}}>
            {props.children}
        </PeerContext.Provider>
    )
}