import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipes.model';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.action';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesChanges = new Subject<Recipe[]>();
  counter = 2;
  private recipes: Recipe[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}
  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    const recipe = this.recipes.slice().find((recipe) => recipe.id === id);
    return recipe;
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanges.next(this.recipes.slice());
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  updateRecipe(id: number, updatedRecipe: Recipe) {
    let index = this.recipes.findIndex((r) => r.id === id);
    this.recipes[index].name = updatedRecipe.name;
    this.recipes[index].description = updatedRecipe.description;
    this.recipes[index].imagePath = updatedRecipe.imagePath;
    this.recipes[index].ingredients = updatedRecipe.ingredients;
    this.recipesChanges.next(this.recipes.slice());
  }
  deleteRecipe(recipeId: number) {
    const recipeIndex = this.recipes.findIndex((r) => r.id === recipeId);
    this.recipes.splice(recipeIndex, 1);
    this.recipesChanges.next(this.recipes.slice());
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanges.next(this.recipes.slice());
  }
}
