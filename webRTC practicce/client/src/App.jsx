import { useState } from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import { SocketProvider } from './providers/Socket'
function App() {
  

  return (
    <div className='app'>
    <Routes>
      <SocketProvider>
        
    <Route path="/" element={<Home/>} />
      </SocketProvider>
    </Routes>
    </div>
  )
}

export default App
