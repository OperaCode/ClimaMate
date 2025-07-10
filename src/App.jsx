import { useState } from 'react'
import './App.css'
import Landing from './components/Landing'
import Home from './components/Home'
import { Route,Routes } from 'react-router-dom'

function App() {
  

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/home' element={<Home/>}/>
      </Routes>
    </>
  )
}

export default App
