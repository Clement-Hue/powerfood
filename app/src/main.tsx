import React from 'react'
import ReactDOM from 'react-dom/client'
import {Board} from "@modules";
import './styles/index.scss'
import {ServicesProvider} from "@providers";
import {QueryClient, QueryClientProvider} from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
           staleTime: Infinity,
           cacheTime: Infinity,
           retry: false
        }
    }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <QueryClientProvider client={queryClient}>
          <ServicesProvider>
              <Board/>
          </ServicesProvider>
      </QueryClientProvider>
  </React.StrictMode>,
)
