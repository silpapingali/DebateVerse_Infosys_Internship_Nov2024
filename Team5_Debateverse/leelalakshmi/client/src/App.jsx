
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { AuthProvide } from './context/AuthContext'

function App() {
  return (
    <div className='main-background'>
      <AuthProvide>
      <Navbar/>
    <h1 className='text-center font-primary text-yellow-400 font-bold text-4xl md:text-3xl mt-4'>DebateHub</h1>
    <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
    <Outlet/>
    </main>
    <Footer/>
    </AuthProvide>
    </div>
  )
}

export default App
