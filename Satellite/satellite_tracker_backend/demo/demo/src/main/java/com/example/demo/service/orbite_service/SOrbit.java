package com.example.demo.service.orbite_service;

import com.example.demo.model.entitie.Satellites;
import com.example.demo.model.response_model.SatellitePosition;
import com.example.demo.model.tld_data.TLEData;
import com.example.demo.service.websocket_service.SWebSocket;
import lombok.Data;
import org.orekit.time.AbsoluteDate;
import org.orekit.time.TimeScalesFactory;
import org.orekit.utils.PVCoordinates;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
@Service
public class SOrbit implements IOrbit
{
    public static final Map<String, TLEData> satellites = new ConcurrentHashMap<>();

    @Autowired
    private SWebSocket sWebSocket;


    /**
     * Function used to update the satellite position every second
     */
    @Override
    @Scheduled(fixedRate = 1000) // Update every second
    public void updateSatellitePosition()
    {
        System.out.println("# of satellites " + SOrbit.satellites.size());
        AbsoluteDate currentDate = new AbsoluteDate(new Date(), TimeScalesFactory.getUTC());

        if (satellites.isEmpty()) {
            System.out.println("No satellites to update");
            return;
        }

        satellites.forEach((name, tleData) -> {
            try {
                PVCoordinates pvCoordinates = tleData.getPropagator().propagate(currentDate).getPVCoordinates();

                // Convert coordinates to lat/long/elevation
                // Note: This is a simplified conversion. You may want to use more accurate methods
                double[] position = pvCoordinates.getPosition().toArray();
                double[] velocity = pvCoordinates.getVelocity().toArray();

                SatellitePosition satellitePosition = new SatellitePosition();
                satellitePosition.setName(name);
                satellitePosition.setLatitude(Math.toDegrees(Math.atan2(position[2],
                        Math.sqrt(position[0] * position[0] + position[1] * position[1]))));
                satellitePosition.setLongitude(Math.toDegrees(Math.atan2(position[1], position[0])));
                satellitePosition.setElevation(Math.sqrt(position[0] * position[0] +
                        position[1] * position[1] + position[2] * position[2]) / 1000.0); // Convert to km
                satellitePosition.setVelocity(velocity);
                satellitePosition.setTimestamp(currentDate.toString());

                // Send update through WebSocket
               this.sWebSocket.sendUpdatedPosition(satellitePosition);

            } catch (Exception e) {
                e.printStackTrace();
            }
        });
    }

    /**
     * Given a satellite calculate the orbit path.
     *
     * @param satelliteName
     */
    @Override
    public ResponseEntity<List<SatellitePosition>> calculateOrbitPath(String satelliteName) {
        TLEData tleData = satellites.get(satelliteName);
        if (tleData == null) {
            throw new IllegalArgumentException("Satellite not found: " + satelliteName);
        }

        List<SatellitePosition> orbitPoints = new ArrayList<>();
        AbsoluteDate currentDate = new AbsoluteDate(new Date(), TimeScalesFactory.getUTC());

        try {
            // Get orbital period in seconds
            double period = tleData.getPropagator().getInitialState().getKeplerianPeriod();

            // Calculate number of points based on period
            // Use more points for longer periods to maintain smooth visualization
            // Minimum 120 points (every 3 degrees) for very short orbits
            // For longer orbits, use one point every 60 seconds
            int numberOfPoints = Math.max(120, (int) (period / 60.0));

            // Calculate time step between points
            double timeStep = period / numberOfPoints;



            // Calculate positions for one complete orbit
            for (int i = 0; i < numberOfPoints; i++) {
                AbsoluteDate pointDate = currentDate.shiftedBy(i * timeStep);
                PVCoordinates pvCoordinates = tleData.getPropagator()
                        .propagate(pointDate)
                        .getPVCoordinates();

                double[] position = pvCoordinates.getPosition().toArray();
                double[] velocity = pvCoordinates.getVelocity().toArray();

                SatellitePosition point = new SatellitePosition();
                point.setName(satelliteName);
                point.setLatitude(Math.toDegrees(Math.atan2(position[2],
                        Math.sqrt(position[0] * position[0] + position[1] * position[1]))));
                point.setLongitude(Math.toDegrees(Math.atan2(position[1], position[0])));
                point.setElevation(Math.sqrt(position[0] * position[0] +
                        position[1] * position[1] + position[2] * position[2]) / 1000.0); // Convert to km
                point.setVelocity(velocity);
                point.setTimestamp(pointDate.toString());

                orbitPoints.add(point);
            }

            // Add the first point again to close the orbit
            if (!orbitPoints.isEmpty()) {
                orbitPoints.add(orbitPoints.get(0));
            }



            return new ResponseEntity<>(orbitPoints, HttpStatus.OK);

        } catch (Exception e) {
            System.out.print(e);
            throw new RuntimeException("Failed to calculate orbit path", e);
        }
    }

}
