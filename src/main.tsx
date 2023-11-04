import React from 'react'
import ReactDOM from 'react-dom/client'
import {Board} from "./modules"
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Board />
  </React.StrictMode>,
)
