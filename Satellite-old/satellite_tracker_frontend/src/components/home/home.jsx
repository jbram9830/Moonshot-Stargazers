import React, { useEffect, useState } from 'react'
import { CameraFlyTo, Viewer } from 'resium'
import Satellite from '../satellite/satellite'
import SatelliteInfo from './satelliteInfo'
import { Cartesian3 } from 'cesium'
import * as satellite from 'satellite.js';

// Update the path to your TLE data JSON file
const TLE_DATA_URL = '/src/components/home/TLE_data.json';

function Home() {
    const [selectedSatellite, setSelectedSatellite] = useState(null);
    const [cameraDestination, setCameraDestination] = useState(null);
    const [realTimePositions, setRealTimePositions] = useState([]);
    const [satellitePositions, setSatellitePositions] = useState([]); // State for satellite positions

    useEffect(() => {
        // Fetch TLE data from the JSON file
        const fetchTleData = async () => {
            try {
                const response = await fetch(TLE_DATA_URL);
                const data = await response.json(); // Parse JSON data
                console.log('Fetched TLE Data:', data); // Log the fetched data

                // Update satellite positions state
                setSatellitePositions(data);
            } catch (error) {
                console.error('Error fetching TLE data:', error);
            }
        };

        fetchTleData(); // Fetch the TLE data on component mount
    }, []);

    useEffect(() => {
        const updateSatellitePositions = () => {
            const newPositions = satellitePositions.map((sat) => {
                if (sat.tle && sat.tle.length === 2) {
                    // Calculate real-time position from TLE
                    const satrec = satellite.twoline2satrec(sat.tle[0], sat.tle[1]);
                    const now = new Date();
                    const positionAndVelocity = satellite.propagate(satrec, now);
                    const positionEci = positionAndVelocity.position;

                    if (!positionEci) {
                        return null;  // Handle case where TLE propagation fails
                    }

                    const gmst = satellite.gstime(now);
                    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                    const longitude = satellite.degreesLong(positionGd.longitude);
                    const latitude = satellite.degreesLat(positionGd.latitude);
                    const height = positionGd.height * 1000;  // Convert from km to meters

                    return { longitude, latitude, height };
                } else {
                    return null; // Handle cases where TLE is missing or invalid
                }
            });

            setRealTimePositions(newPositions.filter(pos => pos)); // Filter out nulls
        };

        // Update positions every second
        const interval = setInterval(updateSatellitePositions, 1000);
        return () => clearInterval(interval);
    }, [satellitePositions]); // Depend on satellitePositions

    const handleSelectSatellite = (index) => {
        setSelectedSatellite(index);
        const satellite = realTimePositions[index];
        const position = Cartesian3.fromDegrees(satellite.longitude, satellite.latitude, satellite.height + 200000);
        setCameraDestination(position);
    };

    return (
        <Viewer
            full
            infoBox={false}
            selectionIndicator={false}
            timeline={false}
            animation={false}
        >
            {realTimePositions.map((satellite, index) => (
                satellite && (
                    <Satellite
                        key={index}
                        index={index}
                        name={satellitePositions[index].name}
                        longitude={satellite.longitude}
                        latitude={satellite.latitude}
                        height={satellite.height}
                        isSelected={selectedSatellite === index}
                        onSelect={handleSelectSatellite}
                    />
                )
            ))}
            {selectedSatellite !== null && (
                <SatelliteInfo
                    satellitePositions={satellitePositions}
                    selectedSatellite={selectedSatellite}
                />
            )}
            {cameraDestination && (
                <CameraFlyTo
                    destination={cameraDestination}
                    duration={2}
                />
            )}
        </Viewer>
    );
}

export default Home;
