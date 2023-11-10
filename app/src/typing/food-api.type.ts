export interface SearchResult {
    foodSearchCriteria: {
        description: string; // A copy of the criteria that were used in the search.
    };
    totalHits: number; // The total number of foods found matching the search criteria.
    currentPage: number; // The current page of results being returned.
    totalPages: number; // The total number of pages found matching the search criteria.
    foods: SearchResultFood[];
    description: string; // The list of foods found matching the search criteria. See Food Fields below.
}

export interface SearchResultFood {
    fdcId: number; // Unique ID of the food.
    dataType: string; // The type of the food data.
    description: string; // The description of the food.
    foodCode?: string; // A unique ID identifying the food within FNDDS.
    foodNutrients: AbridgedFoodNutrient[];
    publicationDate?: string; // Date the item was published to FDC.
    scientificName?: string; // The scientific name of the food.
    brandOwner?: string; // Brand owner for the food. Only applies to Branded Foods.
    brandName?: string
    gtinUpc?: string; // GTIN or UPC code identifying the food. Only applies to Branded Foods.
    ingredients?: string; // The list of ingredients (as it appears on the product label). Only applies to Branded Foods.
    ndbNumber?: string; // Unique number assigned for foundation foods. Only applies to Foundation and SRLegacy Foods.
    additionalDescriptions?: string; // Any additional descriptions of the food.
    allHighlightFields?: string; // allHighlightFields
    score: number; // Relative score indicating how well the food matches the search criteria.
}

export interface AbridgedFoodNutrient {
    nutrientId: number;
    nutrientName: string;
    nutrientNumber: string;
    unitName: string;
    derivationCode: string;
    derivationDescription: string;
    derivationId: number;
    value: number;
    foodNutrientSourceId: number;
    foodNutrientSourceCode: string;
    foodNutrientSourceDescription: string;
    rank: number;
    indentLevel: number;
    foodNutrientId: number;
}