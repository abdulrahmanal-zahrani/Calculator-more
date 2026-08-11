export type IngredientUnit = "g" | "ml" | "cups" | "tbsp" | "tsp" | "pieces";

export interface RecipeIngredientInput {
  name: string;
  quantity: number;
  unit: IngredientUnit;
}

export interface RecipeScalingInput {
  originalServings: number;
  desiredServings: number;
  ingredients: RecipeIngredientInput[];
}

export interface RecipeIngredientResult extends RecipeIngredientInput {
  scaledQuantity: number;
}

export interface RecipeScalingResult {
  scaleFactor: number;
  ingredients: RecipeIngredientResult[];
}

export function scaleRecipe(input: RecipeScalingInput): RecipeScalingResult {
  const { originalServings, desiredServings, ingredients } = input;
  if (originalServings <= 0 || !Number.isFinite(originalServings)) {
    throw new Error("Original servings must be a positive number.");
  }
  if (desiredServings <= 0 || !Number.isFinite(desiredServings)) {
    throw new Error("Desired servings must be a positive number.");
  }

  const scaleFactor = desiredServings / originalServings;

  const scaledIngredients = ingredients.map((ing) => {
    if (ing.quantity < 0) throw new Error("Ingredient quantity must be non-negative.");
    return { ...ing, scaledQuantity: round2(ing.quantity * scaleFactor) };
  });

  return { scaleFactor: round2(scaleFactor), ingredients: scaledIngredients };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
