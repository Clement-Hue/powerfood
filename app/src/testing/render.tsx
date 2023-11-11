import React, {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import {QueryClient, QueryClientProvider} from "react-query";
import { setLogger } from 'react-query'

setLogger({
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console
    error: () => {},
})

const testQueryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            cacheTime: Infinity
        }
    }
});
const Wrapper = ({children}: {children?: React.ReactNode}) => {
   return (
       <QueryClientProvider client={testQueryClient}>
           {children}
       </QueryClientProvider>
   )
}

export default  (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: Wrapper,...options})
