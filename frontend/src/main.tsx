import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./App.tsx"
import './styles/index.scss'
import {ServicesProvider} from "@providers";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ServicesProvider>
          <App/>
      </ServicesProvider>
  </React.StrictMode>,
)
