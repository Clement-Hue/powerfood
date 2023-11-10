import {useContext} from "react";
import {Context as NutrientsContext} from "@providers/NutrientsProvider"
class NutrientsProviderError extends Error {
    constructor() {
        super("useNutrients must be used within a NutrientsProvider.");
        this.name = "NutrientsProviderError";
    }
}

export default function() {
    const context = useContext(NutrientsContext);
    if (!context) {
        throw new NutrientsProviderError();
    }
    return context;
}
