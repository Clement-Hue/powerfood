import {ReactNode} from "react";
import {Provider} from "react-redux";
import {AppStore} from "@store";

const wrapper = (store: AppStore) => {
    return function ({children}: Props) {
        return (
            <Provider store={store} >
                {children}
            </Provider>
        )
    }
}
type Props = {
    children?: ReactNode
}

export default wrapper;