package com.example.demo.model.response_model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SatellitePosition
{
    private String name;
    private double latitude;
    private double longitude;
    private double elevation;
    private double[] velocity;
    private String timestamp;
}
