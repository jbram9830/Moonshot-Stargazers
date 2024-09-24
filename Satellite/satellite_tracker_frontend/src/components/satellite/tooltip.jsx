import React, { useEffect, useState } from 'react'

export default function Tooltip({name}) {
    const [position, setPosition] = useState({x: -1000, y: -1000})

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({x: e.clientX, y: e.clientY})
        }

        window.addEventListener('mousemove', handleMouseMove)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    },[])

  return (
    <div 
      className={`block fixed overflow-hidden z-50 p-2 bg-blue-500 border border-gray-200 rounded-lg shadow-lg pointer-events-none transition-opacity duration-300`}
      style={{ 
        left: `${position.x + 20}px`, 
        top: `${position.y + 20}px`,
      }}
    >
        <p className='text-[16px] text-white'>{name}</p>
    </div>
  )
}
