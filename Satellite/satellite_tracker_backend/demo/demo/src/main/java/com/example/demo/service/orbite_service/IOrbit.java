package com.example.demo.service.orbite_service;

import com.example.demo.model.response_model.SatellitePosition;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.List;

public interface IOrbit
{
    /**
     * Function used to update the satellite position every second
     * */
    void updateSatellitePosition();

    /**
     * Given a satellite calculate the orbit path.
     * */
    ResponseEntity<List<SatellitePosition>> calculateOrbitPath(String satelliteName);
}
