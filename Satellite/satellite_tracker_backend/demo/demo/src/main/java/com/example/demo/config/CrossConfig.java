package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 *
 * Since this a website you can change this to only be accessible from thw website domain.
 *
 * **/

@Configuration
public class CrossConfig
{
    @Value("${spring.allowed.origin}")
    private String origins; // CrossOrigin request

    //Array of strings containing all allowed request Methods
    private static final String[] ALLOWED_REQUESTS =
            {
                    "GET",
                    "POST",
                    "PUT",
                    "DELETE"
            };

    @Bean
    public WebMvcConfigurer corsConfigurer()
    {
        return new WebMvcConfigurer()
        {
            @Override
            public void addCorsMappings(CorsRegistry registry)
            {
                registry.addMapping("/**")
                        .allowedOrigins(origins)
                        .allowedMethods(ALLOWED_REQUESTS)
                        .allowCredentials(true);
            }
        };
    }
}