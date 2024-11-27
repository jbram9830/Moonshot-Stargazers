package com.example.demo.service.satellite_service;


import com.example.demo.model.entitie.Satellites;
import com.example.demo.model.response_model.AddSatellite;
import com.example.demo.model.response_model.ISatellites;
import com.example.demo.model.tld_data.TLEData;
import com.example.demo.repositories.ISatelliteRepo;
import com.example.demo.service.orbite_service.SOrbit;
import com.example.demo.util.UUIDGenerator;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.orekit.propagation.analytical.tle.TLE;
import org.orekit.propagation.analytical.tle.TLEPropagator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class SSatellite implements ISatellite
{
    @Autowired
    private ISatelliteRepo iSatelliteRepo;

    @Autowired
    private UUIDGenerator uuidGenerator;

    /**
     * Use to add one or more satellites to the DB
     *
     * @param satellitesList
     */
    @Override
    @Transactional
    public ResponseEntity<Boolean> addSatellites(List<AddSatellite> satellitesList)
    {
        ResponseEntity<Boolean> response;

        var toAdd =  new ArrayList<Satellites>();

        try
        {
            for(int i = 0; i < satellitesList.size(); i++)
            {
                System.out.println("this is tle" + satellitesList.get(i).getTle());
                toAdd.add(
                        Satellites.builder()
                                .satelliteID(this.uuidGenerator.getPureUUID())
                                .name(satellitesList.get(i).getName())
                                .line1(satellitesList.get(i).getTle().get(0))
                                .line2(satellitesList.get(i).getTle().get(1))
                                .build()
                );
            }

            this.iSatelliteRepo.saveAllAndFlush(toAdd);

            System.out.println("Data Saved");

            for(var satellite : toAdd)
            {
                var tle = new TLE(satellite.getLine1(), satellite.getLine2());
                SOrbit.satellites.put(satellite.getName(),
                        TLEData.builder()
                                .name(satellite.getName())
                                .tle(tle)
                                .propagator(TLEPropagator.selectExtrapolator(tle))
                                .build()
                );
            }

            response = new ResponseEntity<>(true, HttpStatus.OK);
        }
        catch (Exception e)
        {
            System.out.println(e);
            response = new ResponseEntity<>(false, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }

    /**
     * Used to get all Satellites from the DB
     */
    @Override
    public ResponseEntity<List<ISatellites>> getSatellites()
    {
        ResponseEntity<List<ISatellites>> response;
        try
        {
            response = new ResponseEntity<>(this.iSatelliteRepo.getSatellites(), HttpStatus.OK);
        }
        catch (Exception e)
        {
            response = new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return response;
    }

    @PostConstruct
    public void initializeSatellites() {
        try {
            var satellitesList = this.iSatelliteRepo.getSatellitesInitInfo();
            System.out.println("\n=== Starting Satellite Initialization ===");
            System.out.println("Total satellites found in DB: " + satellitesList.size());

            // Print first few satellites to verify data
            System.out.println("\nFirst 5 satellites in list:");
            for(int i = 0; i < Math.min(5, satellitesList.size()); i++) {
                var sat = satellitesList.get(i);
                System.out.println(String.format(
                        "Satellite %d: Name='%s', Line1 length=%d, Line2 length=%d",
                        i + 1,
                        sat.getName(),
                        sat.getLine1().length(),
                        sat.getLine2().length()
                ));
            }

            // Clear existing map to start fresh
            if (!SOrbit.satellites.isEmpty()) {
                System.out.println("\nClearing existing " + SOrbit.satellites.size() + " satellites from map");
                SOrbit.satellites.clear();
            }

            int processedCount = 0;
            Set<String> uniqueNames = new HashSet<>();

            for(var satellite : satellitesList) {
                processedCount++;
                String name = satellite.getName();

                System.out.println(String.format(
                        "\nProcessing satellite %d/%d: %s",
                        processedCount,
                        satellitesList.size(),
                        name
                ));

                // Check for duplicate names
                if (uniqueNames.contains(name)) {
                    System.out.println("WARNING: Duplicate satellite name found: " + name);
                    continue;
                }
                uniqueNames.add(name);

                try {
                    // Verify TLE data before processing
                    if (satellite.getLine1() == null || satellite.getLine2() == null ||
                            satellite.getLine1().trim().isEmpty() || satellite.getLine2().trim().isEmpty()) {
                        System.out.println("ERROR: Invalid TLE data for satellite: " + name);
                        continue;
                    }

                    // Create TLE object
                    System.out.println("Creating TLE for: " + name);
                    var tle = new TLE(satellite.getLine1(), satellite.getLine2());

                    // Create propagator
                    System.out.println("Creating propagator for: " + name);
                    var propagator = TLEPropagator.selectExtrapolator(tle);

                    // Add to map
                    System.out.println("Adding to SOrbit.satellites: " + name);
                    SOrbit.satellites.put(name,
                            TLEData.builder()
                                    .name(name)
                                    .tle(tle)
                                    .propagator(propagator)
                                    .build()
                    );

                    System.out.println("Successfully added: " + name);

                } catch (Exception e) {
                    System.out.println("ERROR processing satellite " + name + ":");
                    System.out.println("  Error type: " + e.getClass().getSimpleName());
                    System.out.println("  Error message: " + e.getMessage());
                    e.printStackTrace();
                }
            }

            System.out.println("\n=== Initialization Summary ===");
            System.out.println("Total satellites in DB: " + satellitesList.size());
            System.out.println("Total processed: " + processedCount);
            System.out.println("Unique names found: " + uniqueNames.size());
            System.out.println("Final size of SOrbit.satellites: " + SOrbit.satellites.size());

            // Print names of successful satellites
            System.out.println("\nSuccessfully initialized satellites:");
            SOrbit.satellites.keySet().forEach(name -> System.out.println("- " + name));

        } catch (Exception e) {
            System.out.println("FATAL ERROR during satellite initialization:");
            e.printStackTrace();
        }
    }
}
