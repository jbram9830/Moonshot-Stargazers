import React from 'react'
import { Viewer} from 'resium'
import Satellite from '../satellite/satellite'


const satellitePositions=[
  { 
    name: 'Satellite over Omaha, NE',
    longitude: -95.9345,
    latitude: 41.2565,
    height: 1000000,
  },
  {
    name: 'Satellite over Phoenix, AZ',
    longitude: -112.0740,
    latitude: 33.4484,
    height: 2000000,
  },
  {
    name: 'Satellite over Miami, FL',
    longitude: -80.1918,
    latitude: 25.7617,
    height: 700000,
  }
]

function Home() {
  return (
    <Viewer full>
      {satellitePositions.map((satellite, index) => (
        <Satellite key={index} name={satellite.name} longitude={satellite.longitude} latitude={satellite.latitude} height={satellite.height}/>
      ))}        
    </Viewer>
  )
}

export default Home