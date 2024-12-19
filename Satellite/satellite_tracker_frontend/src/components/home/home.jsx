import React, { useEffect, useState, useRef } from 'react';
import { Entity, Viewer } from 'resium';
import Satellite from '../satellite/satellite'; // Import the Satellite component
import SatelliteInfo from './satelliteInfo'; // Import the SatelliteInfo component
import { Cartesian3, Color } from 'cesium'; // Import necessary Cesium functions and objects
import * as satellite from 'satellite.js'; // Import satellite.js library

// Update the path to your TLE data JSON file
const TLE_DATA_URL = '/src/components/home/TLE_data.json';

function Home() {
    // States for storing satellite data, positions, new satellite info, collisions, etc.
    const [selectedSatellite, setSelectedSatellite] = useState(null);
    const [realTimePositions, setRealTimePositions] = useState([]);
    const [satellitePositions, setSatellitePositions] = useState([]);
    const [orbitPath, setOrbitPath] = useState([]); // Store orbit path for the selected satellite
    const [newSatellite, setNewSatellite] = useState({ name: '', tle1: '', tle2: '' }); // For new satellite input
    const [collisions, setCollisions] = useState([]); // Store potential collisions
    const [selectedSatellitePosition, setSelectedSatellitePosition] = useState(null); // New state to store selected satellite position
    const viewerRef = useRef(null); // Ref to access Cesium Viewer instance

    // Fetch the TLE data once on component mount
    useEffect(() => {
        const fetchTleData = async () => {
            try {
                const response = await fetch(TLE_DATA_URL); // Fetch TLE data
                const data = await response.json(); // Parse JSON data
                setSatellitePositions(data); // Update state with satellite positions
            } catch (error) {
                console.error('Error fetching TLE data:', error); // Log any error
            }
        };

        fetchTleData();
    }, []); // Empty dependency array to run only once on mount

    // Update real-time satellite positions at regular intervals
    useEffect(() => {
        const updateSatellitePositions = () => {
            const newPositions = satellitePositions.map((sat) => {
                if (sat.tle && sat.tle.length === 2) { // Check if TLE lines are available
                    const satrec = satellite.twoline2satrec(sat.tle[0], sat.tle[1]); // Parse TLE lines
                    const now = new Date(); // Get current time
                    const positionAndVelocity = satellite.propagate(satrec, now); // Calculate position and velocity
                    const positionEci = positionAndVelocity.position;

                    if (!positionEci) return null;

                    const gmst = satellite.gstime(now); // Get GMST (Greenwich Mean Sidereal Time)
                    const positionGd = satellite.eciToGeodetic(positionEci, gmst); // Convert to geodetic coordinates

                    const longitude = satellite.degreesLong(positionGd.longitude) || 'N/A';
                    const latitude = satellite.degreesLat(positionGd.latitude) || 'N/A';
                    const height = positionGd.height * 1000 || 'N/A';

                    return { longitude, latitude, height }; // Return position data
                } else {
                    return null; // Return null if TLE is invalid
                }
            });

            setRealTimePositions(newPositions.filter(pos => pos)); // Update the positions state
        };

        const interval = setInterval(updateSatellitePositions, 1000); // Update every second
        return () => clearInterval(interval); // Clear interval on cleanup
    }, [satellitePositions]); // Depend on satellitePositions to update when the data changes

    // Function to calculate orbit path for a selected satellite
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

                    const longitude = satellite.degreesLong(positionGd.longitude) || 'N/A';
                    const latitude = satellite.degreesLat(positionGd.latitude) || 'N/A';
                    const height = positionGd.height * 1000 || 'N/A';

                    path.push(Cartesian3.fromDegrees(longitude, latitude, height)); // Add position to the orbit path
                }
            }

            setOrbitPath(path); // Update the orbit path state
        }
    };

    // Handle satellite selection from the dropdown
    const handleSelectSatellite = (index) => {
        setSelectedSatellite(index);

        // Calculate the position for the selected satellite
        const sat = satellitePositions[index];
        if (sat && sat.tle && sat.tle.length === 2) {
            const satrec = satellite.twoline2satrec(sat.tle[0], sat.tle[1]);
            const now = new Date();
            const positionAndVelocity = satellite.propagate(satrec, now);
            const positionEci = positionAndVelocity.position;

            if (positionEci) {
                const gmst = satellite.gstime(now);
                const positionGd = satellite.eciToGeodetic(positionEci, gmst);

                const longitude = (satellite.degreesLong(positionGd.longitude) || 0).toFixed(2);  // Round to 2 decimal places
                const latitude = (satellite.degreesLat(positionGd.latitude) || 0).toFixed(2);    // Round to 2 decimal places
                const height = (positionGd.height * 1000 || 0).toFixed(2); // Round to 2 decimal places (height is in meters)

                setSelectedSatellitePosition({
                    name: sat.name, // Store the satellite name
                    longitude,
                    latitude,
                    height,
                });
            }
        }

        // Calculate the orbit path for the selected satellite
        calculateOrbitPath(index);
    };

    // Handle adding a new satellite through a form
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
            const longitude = satellite.degreesLong(positionGd.longitude) || 'N/A';
            const latitude = satellite.degreesLat(positionGd.latitude) || 'N/A';
            const height = positionGd.height * 1000 || 'N/A';

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

    // Function to check for collisions with the newly added satellite
    const checkCollisionsForNewSatellite = (newSatellite) => {
        const potentialCollisions = [];
        const now = new Date();
        const newSatrec = satellite.twoline2satrec(newSatellite.tle[0], newSatellite.tle[1]);

        const timeStep = 300; // Check every 5 minutes (300 seconds)
        const totalTime = 3600; // Check for 1 hour
        const maxIterations = totalTime / timeStep;

        const existingSatellites = satellitePositions.slice(0, satellitePositions.length - 1); // Exclude the new satellite

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
                onSubmit={handleAddSatellite} // Form submission handler
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

            {/* Dropdown to select a satellite */}
            <div
                style={{
                    position: 'absolute',
                    zIndex: 1,
                    background: 'white',
                    padding: '10px',
                    margin: '10px',
                    top: '1%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)', // Centers the element both horizontally and vertically
                    borderRadius: '8px', // Optional: to round the corners
                }}
            >
                <h3>Select Satellite</h3>
                <select
                    onChange={(e) => handleSelectSatellite(Number(e.target.value))}
                    value={selectedSatellite || ''}
                >
                    <option value="">Select a Satellite</option>
                    {satellitePositions.map((sat, index) => (
                        <option key={index} value={index}>
                            {sat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display the position once a satellite is selected */}
            {selectedSatellitePosition && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '25px',   // Position 10px from the bottom of the screen
                        left: '25px',     // Position 10px from the left of the screen
                        zIndex: 1,
                        background: 'white',
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid black',
                    }}
                >
                    <h4>Selected Information</h4>
                    <p>Name: {selectedSatellitePosition.name}</p>
                    <p>Longitude: {selectedSatellitePosition.longitude}</p>
                    <p>Latitude: {selectedSatellitePosition.latitude}</p>
                    <p>Height: {selectedSatellitePosition.height} meters</p>
                </div>
            )}

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
