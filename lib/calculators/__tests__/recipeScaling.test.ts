import { describe, it, expect } from "vitest";
import { scaleRecipe } from "../recipeScaling";

describe("scaleRecipe", () => {
  it("scales ingredients up", () => {
    const result = scaleRecipe({
      originalServings: 4,
      desiredServings: 8,
      ingredients: [{ name: "Flour", quantity: 200, unit: "g" }],
    });
    expect(result.scaleFactor).toBe(2);
    expect(result.ingredients[0].scaledQuantity).toBe(400);
  });

  it("scales ingredients down", () => {
    const result = scaleRecipe({
      originalServings: 4,
      desiredServings: 2,
      ingredients: [{ name: "Sugar", quantity: 100, unit: "g" }],
    });
    expect(result.ingredients[0].scaledQuantity).toBe(50);
  });

  it("throws on non-positive servings", () => {
    expect(() => scaleRecipe({ originalServings: 0, desiredServings: 2, ingredients: [] })).toThrow();
  });
});
