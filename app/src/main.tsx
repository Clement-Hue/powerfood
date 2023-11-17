import React from 'react'
import ReactDOM from 'react-dom/client'
import {Board} from "@modules";
import './styles/index.scss'
import {ServicesProvider} from "@providers";
import {Provider} from "react-redux";
import store from "@store"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <Provider store={store}>
          <ServicesProvider>
              <Board/>
          </ServicesProvider>
      </Provider>
  </React.StrictMode>,
)
