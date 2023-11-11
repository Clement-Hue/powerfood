import React from 'react'
import ReactDOM from 'react-dom/client'
import {Board} from "@modules";
import './styles/index.scss'
import {ServicesProvider} from "@providers";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ServicesProvider>
          <Board/>
      </ServicesProvider>
  </React.StrictMode>,
)
