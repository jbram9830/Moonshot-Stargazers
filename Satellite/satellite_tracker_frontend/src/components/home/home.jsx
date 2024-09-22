import React, { useRef, useState } from 'react'
import { CameraFlyTo, Viewer } from 'resium'
import Satellite from '../satellite/satellite'
import SatelliteInfo from './satelliteInfo'
import { Cartesian3 } from 'cesium'

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
  const [selectedSatellite, setSelectedSatellite] = useState(null)
  const [cameraDestination, setCameraDestination] = useState(null)

  const handleSelectSatellite = (index) => {
    setSelectedSatellite(index)
    const satellite = satellitePositions[index]
    const position = Cartesian3.fromDegrees(satellite.longitude + 0.2, satellite.latitude, satellite.height + 200000)

    setCameraDestination(position)
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
      {cameraDestination && 
      (
      <CameraFlyTo
        destination={cameraDestination}
        duration={2}
      /> 
      )}
      
    </Viewer>
  )
}

export default Home