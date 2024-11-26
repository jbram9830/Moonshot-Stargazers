import React, { useEffect, useState, useCallback, useRef } from 'react'
import { CameraFlyTo, Viewer } from 'resium'
import Satellite from '../satellite/satellite'
import SatelliteInfo from './satelliteInfo'
import { Cartesian3, Color } from 'cesium'
import axios from '../api/api'
import satelliteWebSocket from '../websocket/socket'
import { icons } from '../constants'
import SearchSuggestions from '../searchSuggestions/searchSuggestions'

// Configuration constants
const UPDATE_INTERVAL = 1000
const BUFFER_SIZE = 1000
const CONNECTION_CHECK_INTERVAL = 5000

function Home() {
  // State management
  const [isLoading, setIsLoading] = useState(false)
  const [satellitePositions, setSatellitePositions] = useState(new Map())
  const [selectedSatellite, setSelectedSatellite] = useState(null)
  const [cameraDestination, setCameraDestination] = useState(null)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Refs
  const subscriptionsRef = useRef(new Map())
  const isInitialMount = useRef(true)
  const connectionCheckInterval = useRef(null)
  const updateBufferRef = useRef(new Map())
  const updateTimeoutRef = useRef(null)
  const isProcessingRef = useRef(false)
  const viewerRef = useRef(null)

  // Process batched updates from buffer
  const processUpdateBuffer = useCallback(() => {
    if (isProcessingRef.current || updateBufferRef.current.size === 0) return

    isProcessingRef.current = true

    setSatellitePositions(prevPositions => {
      const updatedPositions = new Map(prevPositions)
      let processedCount = 0

      for (const [satelliteName, newPosition] of updateBufferRef.current) {
        if (processedCount >= BUFFER_SIZE) break

        updatedPositions.set(satelliteName, {
          ...updatedPositions.get(satelliteName),
          ...newPosition,
          longitude: Number(newPosition.longitude),
          latitude: Number(newPosition.latitude),
          elevation: Number(newPosition.elevation)
        })

        updateBufferRef.current.delete(satelliteName)
        processedCount++
      }

      return updatedPositions
    })

    isProcessingRef.current = false

    if (updateBufferRef.current.size > 0) {
      updateTimeoutRef.current = setTimeout(processUpdateBuffer, UPDATE_INTERVAL)
    }
  }, [])

  // Update satellite position with buffering
  const updateSatellitePosition = useCallback((satelliteName, newPosition) => {
    updateBufferRef.current.set(satelliteName, newPosition)

    if (!updateTimeoutRef.current) {
      updateTimeoutRef.current = setTimeout(processUpdateBuffer, UPDATE_INTERVAL)
    }
  }, [processUpdateBuffer])

  // Handle satellite selection
  const handleSelectSatellite = useCallback((satelliteName) => {
    setSelectedSatellite(satelliteName)
    const satellite = satellitePositions.get(satelliteName)
    if (satellite) {
      const position = Cartesian3.fromDegrees(
        Number(satellite.longitude) + 0.2,
        Number(satellite.latitude),
        Number(satellite.elevation) + 2000000
      )
      setCameraDestination(position)

      setTimeout(() => {
        setCameraDestination(null)
      }, 2000)
    }
  }, [satellitePositions])

  // Handle satellite re-center
  const handleRecenterSatellite = useCallback(() => {
    if (selectedSatellite) {
      const satellite = satellitePositions.get(selectedSatellite)
      if (satellite) {
        const position = Cartesian3.fromDegrees(
          Number(satellite.longitude) + 0.2,
          Number(satellite.latitude),
          Number(satellite.elevation) + 2000000
        )
        setCameraDestination(position)

        setTimeout(() => {
          setCameraDestination(null)
        }, 2000)
      }
    }
  }, [selectedSatellite, satellitePositions])

  // Handle search suggestion selection
  const handleSelectSuggestion = useCallback((satellite) => {
    if (satellitePositions.has(satellite.name)) {
      handleSelectSatellite(satellite.name)
    }
    setSearchQuery(satellite.name)
    setShowSuggestions(false)
  }, [satellitePositions, handleSelectSatellite])

  // Render satellites
  const renderedSatellites = useCallback(() => {
    return Array.from(satellitePositions.entries()).map(([_, satellite]) => (
      <Satellite 
        key={satellite.satelliteID || satellite.id}
        name={satellite.name}
        longitude={satellite.longitude}
        latitude={satellite.latitude}
        elevation={satellite.elevation}
        isSelected={selectedSatellite === satellite.name}
        onSelect={() => handleSelectSatellite(satellite.name)}
      />
    ))
  }, [satellitePositions, selectedSatellite, handleSelectSatellite])

  // Initialize WebSocket connection
  useEffect(() => {
    let mounted = true

    const setupWebSocket = async () => {
      if (!satelliteWebSocket.isConnected()) {
        try {
          await satelliteWebSocket.connect()
          if (mounted) {
            setIsConnected(true)
            console.log('WebSocket connected successfully')
          }
        } catch (err) {
          if (mounted) {
            console.error('Failed to connect to WebSocket:', err)
            setError('Failed to connect to real-time updates')
            setIsConnected(false)
          }
        }
      }
    }

    if (!connectionCheckInterval.current) {
      connectionCheckInterval.current = setInterval(() => {
        if (mounted) {
          const currentStatus = satelliteWebSocket.isConnected()
          setIsConnected(currentStatus)
          
          if (!currentStatus) {
            setupWebSocket()
          }
        }
      }, CONNECTION_CHECK_INTERVAL)
    }

    setupWebSocket()

    return () => {
      mounted = false
      if (connectionCheckInterval.current) {
        clearInterval(connectionCheckInterval.current)
        connectionCheckInterval.current = null
      }
    }
  }, [])

  // Subscribe to satellite updates
  const subscribeSatellite = useCallback((satellite) => {
    if (!satellite?.name || !isConnected) return

    if (!subscriptionsRef.current.has(satellite.name)) {
      const subscription = satelliteWebSocket.subscribeSatellite(
        satellite.name,
        (data) => {
          updateSatellitePosition(satellite.name, data)
        }
      )

      if (subscription) {
        subscriptionsRef.current.set(satellite.name, subscription)
      }
    }
  }, [isConnected, updateSatellitePosition])

  // Fetch initial satellite data
  const getSatelliteData = useCallback(async () => {
    if (isLoading) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const res = await axios.get('satellites/get')
      if (res.data && Array.isArray(res.data)) {
        const initialSatellites = new Map()
        res.data.forEach(sat => {
          const name = sat.name || sat.satelliteName
          initialSatellites.set(name, {
            ...sat,
            name,
            longitude: Number(sat.longitude) || 0,
            latitude: Number(sat.latitude) || 0,
            elevation: Number(sat.elevation) || 0,
            velocity: [0, 0, 0],
            timestamp: new Date().toISOString()
          })
        })
        setSatellitePositions(initialSatellites)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch satellite data'
      setError(errorMessage)
      console.error('Error fetching satellite data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

  // Initial data fetch
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      getSatelliteData()
    }
  }, [getSatelliteData])

  // Handle subscriptions
  useEffect(() => {
    if (isConnected && satellitePositions.size > 0) {
      Array.from(satellitePositions.values()).forEach(subscribeSatellite)
    }
  }, [isConnected, satellitePositions, subscribeSatellite])

  // Click outside search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setSearchQuery('')
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      subscriptionsRef.current.forEach((_, satelliteName) => {
        satelliteWebSocket.unsubscribeSatellite(satelliteName)
      })
      subscriptionsRef.current.clear()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading satellites...</div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <Viewer 
        full
        onClick={() => {
          setSearchQuery('')
          setShowSuggestions(false)
        }}
        infoBox={false}
        selectionIndicator={false}
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        navigationHelpButton={false}
        geocoder={false}
        terrainProvider={undefined}
        scene3DOnly={true}
        shadows={false}
        terrain={undefined}
        maximumRenderTimeChange={Infinity}
        useBrowserRecommendedResolution={false}
        fullscreenButton={false}
        terrainShadows={false}
        homeButton={false}
        ref={viewer => {
          if(viewer?.cesiumElement){
            viewerRef.current = viewer
            const scene = viewer.cesiumElement.scene
            
            // Remove celestial objects
            scene.skyBox.show = false
            scene.sun.show = false
            scene.moon.show = false
            scene.skyAtmosphere.show = false
            scene.backgroundColor = Color.BLACK
          }
        }}
      >
        {/* Header and Search */}
        <div className='absolute w-full top-0 left-0 z-10 flex-col'>
          <div className='w-full p-4 bg-white flex border-b-2 border-blue-500'>
            <h1 className='text-[24px] font-bold'>Moonshot-Stargazers</h1>
            <div className='relative search-container outline outline-2 outline-blue-500 ml-4 rounded-lg'>
              <input 
                className='p-2 w-full h-full focus:outline-none' 
                placeholder='Search satellites...' 
                type='text' 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value) 
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
              />
              <SearchSuggestions
                satellites={Array.from(satellitePositions.values())}
                visible={showSuggestions}
                searchQuery={searchQuery}
                onSelect={handleSelectSuggestion}
              />
            </div>
          </div>
          
          {/* Status Panel */}
          <div className="flex-col flex w-fit mt-4 ml-4 justify-center items-start bg-white p-2 rounded shadow">
            <div className="flex justify-center items-center">
              <div className={`w-4 h-4 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}/>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="flex justify-center items-start mt-2"> 
              <div className="w-4 h-4 flex mt-[4px] justify-center items-center">
                <icons.SatelliteIcon />
              </div>   
              <p className="ml-2">
                Satellites tracked: {satellitePositions.size}
              </p>                  
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
                <button 
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={getSatelliteData}
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Satellites */}
        {renderedSatellites()}

        {/* Selected Satellite Info */}
        {selectedSatellite && (
          <SatelliteInfo 
            satellite={satellitePositions.get(selectedSatellite)}
            onRecenter={handleRecenterSatellite}
          />
        )}

        {/* Camera Animation */}
        {cameraDestination && (
          <CameraFlyTo
            destination={cameraDestination}
            duration={2}
            once={true}
          />
        )}
      </Viewer>
    </div>
  )
}

export default Home