package com.example.demo.service.websocket_service;

import com.example.demo.model.response_model.SatellitePosition;

public interface IWebSocket
{
    /**
     * @param satellitePosition : info with the new position of a given satellite.
     *
     * Function used to send the updated info of a given satellite.
     * */
    void sendUpdatedPosition(SatellitePosition satellitePosition);
}
