import {useContext} from "react";
import {Context as FoodsContext} from "@providers/FoodsProvider"

class FoodsProviderError extends Error {
    constructor() {
        super("useFoods must be used within a FoodsProvider.");
        this.name = "FoodsProviderError";
    }
}

export default function() {
    const context = useContext(FoodsContext);
    if (!context) {
        throw new FoodsProviderError();
    }
    return context;
}
