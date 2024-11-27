package com.example.demo.service.websocket_service;

import com.example.demo.model.response_model.SatellitePosition;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class SWebSocket implements IWebSocket
{
    @Value("${app.websocket.satellite-update}")
    private String updateInfo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    /**
     * @param satellitePosition : info with the new position of a given satellite.
     *                          <p>
     *                          Function used to send the updated info of a given satellite.
     */
    @Override
    public void sendUpdatedPosition(SatellitePosition satellitePosition)
    {
        // System.out.println("position: " + satellitePosition.getName() + " " + satellitePosition.getLongitude() + " " + satellitePosition.getLatitude());
        messagingTemplate.convertAndSend("/topic/" + this.updateInfo + satellitePosition.getName(), satellitePosition);
    }
}
