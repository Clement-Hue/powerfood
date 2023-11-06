import {useContext} from "react";
import {Context as ServicesContext} from "@providers/ServicesProvider"

class ServicesProviderError extends Error {
    constructor() {
        super("useServices must be used within a ServicesProvider to access services.");
        this.name = "ServicesProviderError";
    }
}

export default function() {
    const context = useContext(ServicesContext);
    if (!context) {
        throw new ServicesProviderError();
    }
    return context;
}