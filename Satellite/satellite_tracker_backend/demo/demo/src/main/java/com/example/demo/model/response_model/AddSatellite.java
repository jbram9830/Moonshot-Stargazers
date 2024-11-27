package com.example.demo.model.response_model;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddSatellite
{
    private String name;
    private List<String> tle;  // Changed from List<String> to String[]
}
