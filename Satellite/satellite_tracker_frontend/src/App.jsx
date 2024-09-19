import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './components/home/home';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-full h-full'>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App