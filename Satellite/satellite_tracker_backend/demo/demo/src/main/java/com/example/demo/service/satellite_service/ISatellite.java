package com.example.demo.service.satellite_service;

import com.example.demo.model.entitie.Satellites;
import com.example.demo.model.response_model.AddSatellite;
import com.example.demo.model.response_model.ISatellites;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ISatellite
{
    /**
     * Use to add one or more satellites to the DB
     * */
    ResponseEntity<Boolean> addSatellites(List<AddSatellite> satellitesList);

    /**
     * Used to get all Satellites from the DB
     * */
    ResponseEntity<List<ISatellites>> getSatellites();
}
