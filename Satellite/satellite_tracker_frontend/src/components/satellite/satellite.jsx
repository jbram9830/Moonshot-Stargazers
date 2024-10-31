import React, { useMemo, useState, useCallback} from 'react'
import { Entity, useCesium } from 'resium'
import { Cartesian3, DistanceDisplayCondition, NearFarScalar, Color} from 'cesium'
import { icons } from '../constants'
import ReactDOMServer from 'react-dom/server'
import Tooltip from './tooltip'

// eslint-disable-next-line react/prop-types
export default function Satellite({ index, longitude, latitude, height, name, isSelected, onSelect}) {
  const position = Cartesian3.fromDegrees(longitude, latitude, height)
  const groundPosition = Cartesian3.fromDegrees(longitude, latitude, 0)

  const [isHovered, setIsHovered] = useState(false)

  const fillColor = useMemo(() => {
    if(isSelected || isHovered) return '#fff800'
    return '#fff'
  },[isSelected, isHovered])

  const satelliteImageUrl = useMemo(() => {
    const svgString = ReactDOMServer.renderToStaticMarkup(<icons.SatelliteIcon fillColor={fillColor} />)
    const encodedSvg = encodeURIComponent(svgString)
    return `data:image/svg+xml,${encodedSvg}`
  }, [fillColor])

  const handleClick = useCallback(() => {
    onSelect(index)
  }, [index, onSelect])

  return (
    <>
      {/* Satellite */}
      <Entity
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        name={name}
        description='This is a satellite test'
        position={position}
        billboard={{
          image: satelliteImageUrl,
          scale: 0.5,
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
      {isHovered && !isSelected &&
      (
        <Tooltip name={name}/>
      )}
    </>
  )
}