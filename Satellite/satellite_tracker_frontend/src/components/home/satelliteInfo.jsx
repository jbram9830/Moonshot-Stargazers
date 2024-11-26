import React from 'react'
import { icons }  from '../constants'

export default function SatelliteInfo({ satellite, onRecenter }) {
  if (!satellite) return null

  const formatNumber = (num) => {
    return Number(num).toFixed(2)
  }
  
  return (
    <div className='w-[250px] h-fit absolute left-0 bottom-0 ml-4 mb-4 p-4 bg-white rounded-lg'>
        <div className='w-full flex justify-between items-center'>
          <h1 className='w-full text-start text-blue-600 text-[16px] underline'>{satellite.satelliteName || satellite.name}</h1>
          <div onClick={onRecenter} className='w-[30px] h-[30px] flex justify-center items-center rounded-lg hover:cursor-pointer'>
            <icons.RecenterIcon width={'16'} height={'16'} color={'#3b82f6'}/>
          </div>
        </div>
        <div className='w-full mt-4 flex-col justify-center items-center'>
            <div className='w-full mt-[8px] flex justify-between items-center'>
              <p className='text-[14px]'>Longitude:</p>
              <p className='text-[14px]'>{formatNumber(satellite.longitude)}</p>
            </div>
            <div className='w-full mt-[8px] flex justify-between items-center'>
              <p className='text-[14px]'>Latitude:</p>
              <p className='text-[14px]'>{formatNumber(satellite.latitude)}</p>
            </div>
            <div className='w-full mt-[8px] flex justify-between items-center'>
              <p className='text-[14px]'>Elevation:</p>
              <p className='text-[14px]'>{formatNumber(satellite.elevation)}</p>
            </div>
        </div>
    </div>  
  )
}