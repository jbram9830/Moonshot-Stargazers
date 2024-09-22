import React from 'react'
import { icons } from '../constants'

export default function SatelliteInfo({satellitePositions, selectedSatellite}) {
  return (
    <div className='w-[200px] h-[200px] absolute left-0 bottom-0 p-4 bg-white rounded-lg'>
        <h1 className='w-full text-center text-[16px] underline'>Satellite Info</h1>
        <div className='w-full mt-4 flex-col justify-center items-center'>
            <div className='w-full flex justify-between items-center'>
              <p className='text-[14px]'>Name</p>
              <p className='text-[14px]'>{satellitePositions[selectedSatellite].name}</p>
            </div>
            <div className='w-full mt-[8px] flex justify-between items-center'>
              <p className='text-[14px]'>Longitude</p>
              <p className='text-[14px]'>{satellitePositions[selectedSatellite].longitude}</p>
            </div>
            <div className='w-full mt-[8px] flex justify-between items-center'>
              <p className='text-[14px]'>Latitude</p>
              <p className='text-[14px]'>{satellitePositions[selectedSatellite].latitude}</p>
            </div>
            <div className='w-full mt-[8px] flex justify-between items-center'>
              <p className='text-[14px]'>Height</p>
              <p className='text-[14px]'>{satellitePositions[selectedSatellite].height}</p>
            </div>
        </div>
    </div>  
  )
}
