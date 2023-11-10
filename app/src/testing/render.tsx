import {ReactElement} from 'react'
import {render, RenderOptions} from '@testing-library/react'

export default  (
    ui: ReactElement,
    options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, options)
