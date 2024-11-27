package com.example.demo.repositories;

import com.example.demo.model.entitie.Satellites;
import com.example.demo.model.response_model.ISatelliteInitInfo;
import com.example.demo.model.response_model.ISatellites;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ISatelliteRepo extends JpaRepository<Satellites, String>
{
    @Query(value = "SELECT satellite_id as satelliteID, name as satelliteName from satellites", nativeQuery = true)
    List<ISatellites> getSatellites();

    @Query(value = "SELECT name as name , line_1 as line1, line_2 as line2 from satellites", nativeQuery = true)
    List<ISatelliteInitInfo> getSatellitesInitInfo();
}
