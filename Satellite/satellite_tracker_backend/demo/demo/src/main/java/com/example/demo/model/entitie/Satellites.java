package com.example.demo.model.entitie;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "satellites")
public class Satellites
{
    @Id
    @Column(name = "satellite_id")
    private String satelliteID;

    @Column(name = "name", nullable = false)
    private String name;

    ///TLE INFO FOR THIS SATELLITE

    @Column(name = "line_1", nullable = false)
    private String line1;

    @Column(name = "line_2", nullable = false)
    private String line2;

}
