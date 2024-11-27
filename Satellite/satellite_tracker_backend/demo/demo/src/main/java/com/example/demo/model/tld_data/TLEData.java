package com.example.demo.model.tld_data;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.orekit.propagation.analytical.tle.TLE;
import org.orekit.propagation.analytical.tle.TLEPropagator;


@Data
@Builder
@AllArgsConstructor
public class TLEData
{
    private final String name;
    private final TLE tle;
    private final TLEPropagator propagator;
}
