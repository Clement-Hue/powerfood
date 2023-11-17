import {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import wrapper from "./Wrapper.tsx";
import {AppStore, RootState, setupStore} from "@store";
import {PreloadedState} from "@reduxjs/toolkit";
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
    preloadedState?: PreloadedState<RootState>
    store?: AppStore
}
export default  (
    ui: ReactElement,
    {preloadedState, store = setupStore(preloadedState),...options}: ExtendedRenderOptions = {}
) => render(ui, {wrapper: wrapper(store),...options})
