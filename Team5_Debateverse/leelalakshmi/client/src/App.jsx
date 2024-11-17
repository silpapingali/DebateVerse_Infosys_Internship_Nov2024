import React,{useState,createContext} from 'react'
import { Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

export const store = createContext();

const App = ()=> {
  const [token,setToken] = useState(null);
  return (
    <div className='main-background'>
      <store.Provider value={[token,setToken]}>
      <Navbar/>
    <h1 className='text-center font-primary text-yellow-400 font-bold text-4xl md:text-3xl mt-4'>DebateHub</h1>
    <main className='min-h-screen max-w-screen-2xl mx-auto px-4 py-6 font-primary'>
    <Outlet/>
    </main>
    <Footer/>
    </store.Provider>
    </div>
  )
}

export default App
