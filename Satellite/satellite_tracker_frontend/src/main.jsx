import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { Ion } from 'cesium'
import "cesium/Build/Cesium/Widgets/widgets.css"

Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_TOKEN

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
