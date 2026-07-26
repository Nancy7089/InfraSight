import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// openssl req -x509 -nodes -days 365 -newkey rsa:2048 -subj "/CN=crux.internal" -keyout /opt/crux/certs/server.key -out /opt/crux/certs/server.crt

// sed -i 's/SuperSecret123/${DB_PASSWORD}/g' /opt/crux/app/config.yaml && grep -Ri password /opt/crux/app