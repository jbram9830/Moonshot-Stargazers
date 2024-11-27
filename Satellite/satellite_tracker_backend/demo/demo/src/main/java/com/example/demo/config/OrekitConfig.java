package com.example.demo.config;

import jakarta.annotation.PostConstruct;
import org.orekit.data.DataContext;
import org.orekit.data.DataProvidersManager;
import org.orekit.data.DirectoryCrawler;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class OrekitConfig
{
    @PostConstruct
    public void initializeOrekit() {
        try {
            // Try to load from classpath first
            String orekitData = getClass().getClassLoader().getResource("orekit-data").getPath();
            DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
            manager.addProvider(new DirectoryCrawler(new File(orekitData)));
        } catch (Exception e) {
            //log.error("Could not initialize Orekit data from classpath", e);

            // Fallback to environment variable or configuration
            String orekitPath = System.getenv("OREKIT_DATA");
            if (orekitPath == null) {
                orekitPath = "src/main/resources/orekit-data";  // Configure this
            }

            try {
                File orekitData = new File(orekitPath);
                DataProvidersManager manager = DataContext.getDefault().getDataProvidersManager();
                manager.addProvider(new DirectoryCrawler(orekitData));
            } catch (Exception ex) {
                throw new RuntimeException("Could not initialize Orekit data", ex);
            }
        }
    }
}
