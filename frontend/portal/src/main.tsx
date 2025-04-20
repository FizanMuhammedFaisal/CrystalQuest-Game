import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// For local development only - in production this will be provided by the host
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
