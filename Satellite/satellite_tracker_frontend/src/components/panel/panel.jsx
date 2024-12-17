import React, { useRef } from 'react'
import axios from '../api/api'

export default function Panel({setIsPanelOpen}) {
    const nameRef = useRef()
    const tleLine1 = useRef()
    const tleLine2 = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            const request = {
                satelliteList: [
                    {
                        name: nameRef.current.value,
                        tle: [
                            tleLine1.current.value,
                            tleLine2.current.value
                        ]
                    }
                ]
            }

            const res = await axios.post('satellites/add', request)

            if(res.data) {
                console.log('satellite added')
                window.location.reload()
            }
        }
        catch(error){
            console.log('Adding Satellite Error:', error)
        }
    }

  return (
    <div className='w-full h-full absolute flex justify-end items-end bg-black/50 top-0 z-50'>
        <div className='w-[500px] flex flex-col justify-between items-center h-full bg-white p-4'>
            <div className='w-full flex justify-end items-end'>
                <div onClick={() => setIsPanelOpen(false)} className='w-[28px] h-[28px] relative hover:cursor-pointer'>
                    <div className='absolute w-full h-[2px] bg-black top-1/2 -translate-y-1/2 rotate-45'/>
                    <div className='absolute w-full h-[2px] bg-black top-1/2 -translate-y-1/2 -rotate-45'/>
                </div>
            </div>
            {/*Add form*/}
            <div>
            <h1 className='w-full text-center text-4xl'>Add New Satellite</h1>
            <form className='space-y-6 mt-[16px]' onSubmit={handleSubmit}>
                {/*satellite name*/}
                <input
                ref={nameRef}
                id='satellite'
                type='name'
                className='w-full p-3 border border-gray-300 rounded-lg'
                placeholder='Satellite Name'
                required
                />
                {/*tle 1*/}
                <input
                ref={tleLine1}
                id='line1'
                type='text'
                className='w-full p-3 border border-gray-300 rounded-lg'
                placeholder='TLE Line 1'
                required
                />
                {/*tle 2*/}
                <input
                ref={tleLine2}
                id='line2'
                type='text'
                className='w-full p-3 border border-gray-300 rounded-lg'
                placeholder='TLE Line 2'
                required
                />
                {/*Submit Button*/}
                <button 
                type="submit" 
                className='w-full flex justify-center p-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                    Add Satellite
                </button>
            </form>
            </div>
            {/*Log out button*/}
            <div></div>
        </div>
    </div>
  )
}