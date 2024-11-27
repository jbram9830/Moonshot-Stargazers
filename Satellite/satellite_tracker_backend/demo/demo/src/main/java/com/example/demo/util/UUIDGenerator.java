package com.example.demo.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

/**
 * ID generator.
 * */

@Component
public class UUIDGenerator
{
    /**
     * @return string containing a pure UUID
     *
     * Create a complete  UUID without "- plus date abd time.
     * */
    public final String getPureUUID()
    {
        //Add date and time of creation at the end to make the UUID more unique. to the pure UUID
        return (UUID.randomUUID().toString().replace("-", "")) + LocalDate.now() + LocalTime.now();
    }
}
