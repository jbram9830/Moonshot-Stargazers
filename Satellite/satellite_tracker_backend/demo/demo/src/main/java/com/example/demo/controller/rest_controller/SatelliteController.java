package com.example.demo.controller.rest_controller;

import com.example.demo.controller.base_url.BaseUrl;
import com.example.demo.model.response_model.ISatellites;
import com.example.demo.model.response_model.Request;
import com.example.demo.model.response_model.SatellitePosition;
import com.example.demo.service.orbite_service.SOrbit;
import com.example.demo.service.satellite_service.SSatellite;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SatelliteController extends BaseUrl
{
    @Autowired
    private SSatellite satellite;

    @Autowired
    private SOrbit sOrbit;

    /**
     *  Public endpoint
     * @param request: body containing the list of new satellite info to be added.
     * @return ResponseEntity: true if the satellite(s) was/were added to DB
     *
     * Request POST: Used to add one or several satellites to the DB
     *
     * HTTP STATUS:
     * 200: OK
     * 500: INTERNAL_SERVER_ERROR
     * */
    @PostMapping("satellites/add")
    public ResponseEntity<Boolean> addSatellites(@RequestBody Request request) // marked to delete
    {
        System.out.println("I am here");
        var response = this.satellite.addSatellites(request.getSatelliteList());
        System.out.println("I am here end");
        return response;
    }


    /**
     *  Public endpoint
     *
     * @return ResponseEntity:
     *
     * Request GET: Used get all the satellites names
     *
     * HTTP STATUS:
     * 200: OK
     * 500: INTERNAL_SERVER_ERROR
     * */
    @GetMapping("satellites/get")
    public ResponseEntity<List<ISatellites>> getSatellites() // marked to delete
    {
        return this.satellite.getSatellites();
    }

    /**
     *  Public endpoint
     *
     * @return ResponseEntity:
     *
     * Request GET: Used to add one or several satellites to the DB
     *
     * HTTP STATUS:
     * 200: OK
     * 500: INTERNAL_SERVER_ERROR
     * */
    @GetMapping("satellites/calculate/path")
    public ResponseEntity<List<SatellitePosition>> calculatePath(@RequestParam String name) // marked to delete
    {
        return this.sOrbit.calculateOrbitPath(name);
    }
}
