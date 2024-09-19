import React, { useMemo } from 'react'
import { Entity } from 'resium'
import { Cartesian3, DistanceDisplayCondition, NearFarScalar } from 'cesium'
import { icons } from '../constants'
import ReactDOMServer from 'react-dom/server'

export default function Satellite({longitude, latitude, height, name}) {
    const position = Cartesian3.fromDegrees(longitude, latitude, height)
    
    const satelliteImageUrl = useMemo(() => {
        const svgString = ReactDOMServer.renderToStaticMarkup(<icons.SatelliteIcon />)
        const encodedSvg = encodeURIComponent(svgString)
        return `data:image/svg+xml,${encodedSvg}`
    }, [])

  return (
    <Entity
        name={name}
        description='This a satellite test'
        position={position}
        billboard={{
          image: satelliteImageUrl,
          scale: 0.5,
          horizontalOrigin: 0,
          verticalOrigin: 0,
          scaleByDistance: new NearFarScalar(1.5e6, 1.0, 2.0e7, 0.1),
          distanceDisplayCondition: new DistanceDisplayCondition(0, 10.0e7),
        }}
    />
  )
}
