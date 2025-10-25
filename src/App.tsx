import { Toaster } from 'sonner'
import './App.css'
import { AppRouter } from './router'
import React from 'react'

function App() {
  return (
    <React.StrictMode>
      <>
        <AppRouter/>
        <Toaster />
      </>
    </React.StrictMode>
  )
}

export default App
