import { useState } from 'react'
import AppRoutes from './routes/AppRoutes'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function App() {

  return (
    <>
     <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <AppRoutes  />
      <Footer />
    </div>
    </>
  )
}

export default App
