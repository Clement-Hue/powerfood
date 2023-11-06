import React, {createContext} from "react";
import envServicesConfig from "./env-services.config.ts"
import {Services} from "@typing/internal.type.ts"

export const Context = createContext<Services | null >(null  );
const ServicesProvider: React.FC<Props> = ({children,overrides} ) => {
    return (
        <Context.Provider value={{
            ...envServicesConfig[process.env.NODE_ENV as keyof typeof envServicesConfig],
            ...overrides as Partial<Services>
        }} >
            {children}
        </Context.Provider>
    )
}

type DeepPartial<T> = T extends object ? {
    [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export type ServicesOverride = DeepPartial<Services>

type Props = {
    children?: React.ReactNode
    overrides?: ServicesOverride
}

export default ServicesProvider;