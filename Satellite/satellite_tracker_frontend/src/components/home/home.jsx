import React, { useEffect, useState, useRef } from 'react';
import { Entity, Viewer } from 'resium';
import Satellite from '../satellite/satellite';
import SatelliteInfo from './satelliteInfo';
import { Cartesian3, Color } from 'cesium';
import * as satellite from 'satellite.js';

// Update the path to your TLE data JSON file
const TLE_DATA_URL = '/src/components/home/TLE_data.json';

function Home() {
    const [selectedSatellite, setSelectedSatellite] = useState(null);
    const [realTimePositions, setRealTimePositions] = useState([]);
    const [satellitePositions, setSatellitePositions] = useState([]);
    const [orbitPath, setOrbitPath] = useState([]); // Store orbit path for the selected satellite
    const [newSatellite, setNewSatellite] = useState({ name: '', tle1: '', tle2: '' }); // For new satellite input
    const [collisions, setCollisions] = useState([]); // Store potential collisions
    const viewerRef = useRef(null); // Ref to access Cesium Viewer instance

    useEffect(() => {
        // Fetch TLE data
        const fetchTleData = async () => {
            try {
                const response = await fetch(TLE_DATA_URL);
                const data = await response.json();
                setSatellitePositions(data);
            } catch (error) {
                console.error('Error fetching TLE data:', error);
            }
        };

        fetchTleData();
    }, []);

    useEffect(() => {
        // Calculate real-time positions
        const updateSatellitePositions = () => {
            const newPositions = satellitePositions.map((sat) => {
                if (sat.tle && sat.tle.length === 2) {
                    const satrec = satellite.twoline2satrec(sat.tle[0], sat.tle[1]);
                    const now = new Date();
                    const positionAndVelocity = satellite.propagate(satrec, now);
                    const positionEci = positionAndVelocity.position;

                    if (!positionEci) return null;

                    const gmst = satellite.gstime(now);
                    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                    const longitude = satellite.degreesLong(positionGd.longitude);
                    const latitude = satellite.degreesLat(positionGd.latitude);
                    const height = positionGd.height * 1000;

                    return { longitude, latitude, height };
                } else {
                    return null;
                }
            });

            setRealTimePositions(newPositions.filter(pos => pos));
        };

        const interval = setInterval(updateSatellitePositions, 1000);
        return () => clearInterval(interval);
    }, [satellitePositions]);

    const calculateOrbitPath = (satIndex) => {
        const sat = satellitePositions[satIndex];
        if (sat.tle && sat.tle.length === 2) {
            const satrec = satellite.twoline2satrec(sat.tle[0], sat.tle[1]);
            const now = new Date();
            const path = [];

            for (let i = 0; i < 1440; i++) { // Calculate positions every minute for 90 minutes
                const time = new Date(now.getTime() + i * 60000);
                const positionAndVelocity = satellite.propagate(satrec, time);
                const positionEci = positionAndVelocity.position;

                if (positionEci) {
                    const gmst = satellite.gstime(time);
                    const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                    const longitude = satellite.degreesLong(positionGd.longitude);
                    const latitude = satellite.degreesLat(positionGd.latitude);
                    const height = positionGd.height * 1000;

                    path.push(Cartesian3.fromDegrees(longitude, latitude, height));
                }
            }

            setOrbitPath(path); // Update orbit path state
        }
    };

    const handleSelectSatellite = (index) => {
        setSelectedSatellite(index);

        // Calculate the orbit path for the selected satellite
        calculateOrbitPath(index);
    };

    const handleAddSatellite = (event) => {
        event.preventDefault(); // Prevent form submission from reloading the page

        const { name, tle1, tle2 } = newSatellite;

        // Validate input fields
        if (!name.trim() || !tle1.trim() || !tle2.trim()) {
            alert('Please fill in all fields.');
            return;
        }

        if (!tle1.startsWith('1 ') || !tle2.startsWith('2 ')) {
            alert('TLE lines must start with "1 " and "2 ".');
            return;
        }

        if (tle1.length < 69 || tle2.length < 69) {
            alert('Each TLE line must be at least 69 characters long.');
            return;
        }

        // Create a new satellite object
        const newSat = {
            name: name.trim(),
            tle: [tle1.trim(), tle2.trim()],
        };

        // Append the new satellite to the list
        const updatedSatellites = [...satellitePositions, newSat];
        setSatellitePositions(updatedSatellites);

        // Calculate its position immediately
        const satrec = satellite.twoline2satrec(newSat.tle[0], newSat.tle[1]);
        const now = new Date();
        const positionAndVelocity = satellite.propagate(satrec, now);

        if (positionAndVelocity.position) {
            const gmst = satellite.gstime(now);
            const positionGd = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
            const longitude = satellite.degreesLong(positionGd.longitude);
            const latitude = satellite.degreesLat(positionGd.latitude);
            const height = positionGd.height * 1000;

            const newPosition = {
                longitude,
                latitude,
                height,
            };

            // Update real-time positions with the new satellite
            setRealTimePositions([...realTimePositions, newPosition]);

            // Run collision detection only for the new satellite
            checkCollisionsForNewSatellite(newSat);
        } else {
            alert('Error calculating the position of the new satellite.');
        }

        // Clear input fields
        setNewSatellite({ name: '', tle1: '', tle2: '' });

        alert(`Satellite "${name.trim()}" added successfully!`);
    };

    const checkCollisionsForNewSatellite = (newSatellite) => {
        const potentialCollisions = [];
        const now = new Date();
        const newSatrec = satellite.twoline2satrec(newSatellite.tle[0], newSatellite.tle[1]);

        const timeStep = 300; // Check every 5 minutes (300 seconds)
        const totalTime = 3600; // Check for 1 hour
        const maxIterations = totalTime / timeStep;

        const existingSatellites = satellitePositions.slice(0, satellitePositions.length - 1);

        let iteration = 0;

        const calculateBatch = () => {
            if (iteration >= maxIterations) {
                // Display results once all iterations are complete
                setCollisions(potentialCollisions);

                if (potentialCollisions.length > 0) {
                    alert('Collision detected!');
                } else {
                    alert('No collisions detected for the new satellite.');
                }
                return;
            }

            const time = new Date(now.getTime() + iteration * timeStep * 1000);

            for (const existingSatellite of existingSatellites) {
                const existingSatrec = satellite.twoline2satrec(existingSatellite.tle[0], existingSatellite.tle[1]);

                const pos1 = satellite.propagate(newSatrec, time).position;
                const pos2 = satellite.propagate(existingSatrec, time).position;

                if (pos1 && pos2) {
                    const distance = Cartesian3.distance(
                        Cartesian3.fromArray([pos1.x, pos1.y, pos1.z]),
                        Cartesian3.fromArray([pos2.x, pos2.y, pos2.z])
                    ) / 1000; // Distance in kilometers

                    if (distance < 1) { // Collision threshold: 1 km
                        potentialCollisions.push({
                            satellites: [newSatellite.name, existingSatellite.name],
                            time: time.toISOString(),
                            distance: distance.toFixed(3),
                        });
                    }
                }
            }

            iteration++;
            setTimeout(calculateBatch, 50); // Spread calculations over time
        };

        calculateBatch();
    };

    return (
        <>
            <form
                onSubmit={handleAddSatellite}
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    background: 'white',
                    padding: '10px',
                    margin: '10px',
                    borderRadius: '8px',
                }}
            >
                <h3>Add a New Satellite</h3>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={newSatellite.name}
                            onChange={(e) => setNewSatellite({ ...newSatellite, name: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        TLE Line 1:
                        <input
                            type="text"
                            value={newSatellite.tle1}
                            onChange={(e) => setNewSatellite({ ...newSatellite, tle1: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        TLE Line 2:
                        <input
                            type="text"
                            value={newSatellite.tle2}
                            onChange={(e) => setNewSatellite({ ...newSatellite, tle2: e.target.value })}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Satellite</button>
            </form>

            {collisions.length > 0 && (
                <div
                    style={{
                        position: 'absolute',
                        top: '250px',
                        left: '10px',
                        zIndex: 1,
                        background: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid red',
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}
                >
                    <h3>Potential Collisions</h3>
                    <ul>
                        {collisions.map((collision, index) => (
                            <li key={index}>
                                <strong>{collision.satellites[0]}</strong> and{' '}
                                <strong>{collision.satellites[1]}</strong> at{' '}
                                {collision.time} (Distance: {collision.distance} km)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Viewer
                ref={viewerRef}
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

                {orbitPath.length > 0 && (
                    <Entity
                        polyline={{
                            positions: orbitPath,
                            width: 2,
                            material: Color.ORANGERED,
                        }}
                    />
                )}

                {selectedSatellite !== null && (
                    <SatelliteInfo
                        satellitePositions={satellitePositions}
                        selectedSatellite={selectedSatellite}
                    />
                )}
            </Viewer>
        </>
    );
}

export default Home;


