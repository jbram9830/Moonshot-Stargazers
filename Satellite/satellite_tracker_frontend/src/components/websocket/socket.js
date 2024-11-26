import { Client } from '@stomp/stompjs'

class SatelliteWebSocket {
  static instance = null;
  
  constructor(serverUrl = import.meta.env.VITE_PUBLIC_WEBSOCKET_URL) {
    if (SatelliteWebSocket.instance) {
      return SatelliteWebSocket.instance
    }
    
    this.client = new Client({
      brokerURL: serverUrl,
      debug: function (str) {
        //console.log('STOMP: ' + str)
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    this.subscriptions = new Map()
    this.connectionPromise = null
    this.setupClient()
    
    SatelliteWebSocket.instance = this
  }

  setupClient() {
    this.client.onConnect = () => {
      console.log('Connected to WebSocket')
      // Resubscribe to all previous subscriptions after reconnection
      this.subscriptions.forEach((callback, satelliteName) => {
        this.subscribeSatellite(satelliteName, callback)
      })
    }

    this.client.onStompError = (frame) => {
      console.error('STOMP error:', frame)
    }

    this.client.onWebSocketError = (event) => {
      console.error('WebSocket error:', event)
    }

    this.client.onDisconnect = () => {
      console.log('STOMP client disconnected')
    }
  }

  connect() {
    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        try {
          this.client.activate()
          // Wait for actual connection before resolving
          const checkConnection = setInterval(() => {
            if (this.client.connected) {
              clearInterval(checkConnection)
              resolve()
            }
          }, 100)
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkConnection)
            reject(new Error('Connection timeout'))
          }, 10000)
        } catch (error) {
          reject(error)
        }
      })
    }
    return this.connectionPromise
  }

  disconnect() {
    if (this.client.active) {
      this.subscriptions.clear()
      this.client.deactivate()
      this.connectionPromise = null
    }
  }

  subscribeSatellite(satelliteName, callback) {
    const topic = `/topic/update/position/${satelliteName}`
    
    // Store the callback for reconnection purposes
    this.subscriptions.set(satelliteName, callback)

    if (this.client.connected) {
      try {
        return this.client.subscribe(topic, (message) => {
          try {
            const data = JSON.parse(message.body)
            //console.log('Received data for satellite:', satelliteName, data)
            callback(data)
          } catch (error) {
            console.error(`Error parsing message for satellite ${satelliteName}:`, error)
          }
        })
      } catch (error) {
        console.error(`Error subscribing to satellite ${satelliteName}:`, error)
      }
    } else {
      console.log(`Client not connected, queuing subscription for ${satelliteName}`)
    }
  }

  unsubscribeSatellite(satelliteName) {
    this.subscriptions.delete(satelliteName)
  }

  isConnected() {
    return this.client.connected
  }
}


export default new SatelliteWebSocket()