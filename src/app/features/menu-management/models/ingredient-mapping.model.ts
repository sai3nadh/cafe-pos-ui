export interface MenuItemIngredient {
    menuIngrId: number;
    ingredientId: number;
    ingredientName: string;
    quantity: number;
    unit: string;
  }
  

  export interface MenuItemWithIngredients {
    menuItemId: number;
    menuItemName: string;
    categoryId: number;
    categoryName: string;
    ingredients: MenuItemIngredient[];
  }
  
//   export interface MenuItemWithIngredients {
//   menuItemId: number;
//   menuItemName: string;
//   categoryId: number;
//   categoryName: string;
//   ingredients: MenuItemIngredient[];
// }
