import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { Entity } from 'resium'
import { Cartesian3, DistanceDisplayCondition, NearFarScalar, Color } from 'cesium'
import { icons } from '../constants'
import ReactDOMServer from 'react-dom/server'
import Tooltip from './tooltip'
import axios from '../api/api'

export default function Satellite({ index, longitude, latitude, elevation, name, isSelected, onSelect }) {
  // State for trajectory points
  const [trajectoryPoints, setTrajectoryPoints] = useState([])
  
  // Convert string values to numbers
  const numLongitude = Number(longitude)
  const numLatitude = Number(latitude)
  const numElevation = Number(elevation)

  // Validate coordinates
  const position = useMemo(() => {
    if (isNaN(numLongitude) || isNaN(numLatitude) || isNaN(numElevation)) {
      console.warn(`Invalid coordinates for satellite ${name}:`, { longitude, latitude, elevation })
      return Cartesian3.fromDegrees(0, 0, 0)
    }
    return Cartesian3.fromDegrees(numLongitude, numLatitude, numElevation)
  }, [numLongitude, numLatitude, numElevation, name])

  const groundPosition = useMemo(() => {
    if (isNaN(numLongitude) || isNaN(numLatitude)) {
      return Cartesian3.fromDegrees(0, 0, 0)
    }
    return Cartesian3.fromDegrees(numLongitude, numLatitude, 0)
  }, [numLongitude, numLatitude])

  const [isHovered, setIsHovered] = useState(false)

  const fillColor = useMemo(() => {
    if (isSelected || isHovered) return '#fff800'
    return '#fff'
  }, [isSelected, isHovered])

  const satelliteImageUrl = useMemo(() => {
    const svgString = ReactDOMServer.renderToStaticMarkup(<icons.SatelliteIcon fillColor={fillColor} />)
    const encodedSvg = encodeURIComponent(svgString)
    return `data:image/svg+xml,${encodedSvg}`
  }, [fillColor])

  // Convert trajectory points to Cartesian3 positions
  const trajectoryPositions = useMemo(() => {
    return trajectoryPoints.map(point => 
      Cartesian3.fromDegrees(
        Number(point.longitude),
        Number(point.latitude),
        Number(point.elevation)
      )
    )
  }, [trajectoryPoints])

  // Fetch trajectory
  useEffect(() => {
    let isMounted = true

    const fetchTrajectory = async () => {
      if (isSelected && name) {
        try {
          const response = await axios.get(`satellites/calculate/path?name=${encodeURIComponent(name)}`)
          if (isMounted && response.data) {
            setTrajectoryPoints(response.data)
          }
        } catch (error) {
          console.error('Failed to fetch satellite trajectory:', error)
        }
      } else {
        setTrajectoryPoints([])
      }
    }

    fetchTrajectory()

    return () => {
      isMounted = false
    }
  }, [isSelected, name])

  const handleClick = useCallback(() => {
    onSelect(index)
  }, [index, onSelect])

  return (
    <>
      {/* Satellite */}
      <Entity
        className='transition-all transform duration-300'
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        name={name}
        description='This is a satellite test'
        position={position}
        billboard={{
          image: satelliteImageUrl,
          scale: isSelected  ? 0.9 : 0.3,
          horizontalOrigin: 0,
          verticalOrigin: 0,
          scaleByDistance: new NearFarScalar(1.5e6, 1.0, 2.0e7, 0.1),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 100.0e7),
        }}
      />

      {/* Anchor line to the ground */}
      {isSelected && (
        <Entity
          onClick={() => {}}
          polyline={{
            positions: [position, groundPosition],
            width: 1,
            material: Color.YELLOW.withAlpha(0.5),
            distanceDisplayCondition: new DistanceDisplayCondition(0, 100.0e7),
          }}
        />
      )}

      {/* Trajectory path */}
      {isSelected && trajectoryPositions.length > 0 && (
        <Entity
          polyline={{
            positions: trajectoryPositions,
            width: 2,
            material: Color.YELLOW.withAlpha(0.8),
            distanceDisplayCondition: new DistanceDisplayCondition(0, 100.0e7),
          }}
        />
      )}

      {isHovered && !isSelected && (
        <Tooltip name={name}/>
      )}
    </>
  )
}