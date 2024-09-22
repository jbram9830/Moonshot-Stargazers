import React, { useState } from 'react'
import { Viewer } from 'resium'
import Satellite from '../satellite/satellite'
import SatelliteInfo from './satelliteInfo'

const satellitePositions = [
  { 
    name: 'Satellite1',
    longitude: -95.9345,
    latitude: 41.2565,
    height: 1000000,
  },
  {
    name: 'Satellite2',
    longitude: -112.0740,
    latitude: 33.4484,
    height: 2000000,
  },
  {
    name: 'Satellite3',
    longitude: -80.1918,
    latitude: 25.7617,
    height: 700000,
  }
]

function Home() {
  const [selectedSatellite, setSelectedSatellite] = useState(0)

  const handleSelectSatellite = (index) => {
    setSelectedSatellite(index)
  }

  return (
    <Viewer 
      full
      infoBox={false}
      selectionIndicator={false}
      timeline={false}
      animation={false}
    >
      {satellitePositions.map((satellite, index) => (
        <Satellite 
          key={index} 
          index={index} 
          name={satellite.name} 
          longitude={satellite.longitude} 
          latitude={satellite.latitude} 
          height={satellite.height} 
          isSelected={selectedSatellite === index} 
          onSelect={handleSelectSatellite}
        />
      ))}   
      {selectedSatellite !== null && (
        <SatelliteInfo 
          satellitePositions={satellitePositions} 
          selectedSatellite={selectedSatellite}
        />
      )}  
    </Viewer>
  )
}

export default Home