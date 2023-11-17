import {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'
import Wrapper from "./Wrapper.tsx";
export default  (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, {wrapper: Wrapper,...options})
