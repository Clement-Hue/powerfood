import React, {Provider} from "react-redux";
import store from "@store";

function Wrapper({children}: Props) {
    return (
        <Provider store={store} >
            {children}
        </Provider>
    )
}
type Props = {
    children?: React.ReactNode
}

export default Wrapper;