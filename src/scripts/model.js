/**
 * @module model
 * @description
 * Module responsible for managing and storing the global state of the application.
 * Includes functions for loading recipes from the external API and normalizing data.
 */
import { URL_API, KEY_API } from './config.js';
import SearchService from './services/searchService.js';

// Instancia del servicio
export const searchService = new SearchService(URL_API);

/**
 * @typedef {Object} Ingredient
 * @property {number} [quantity] - Cantidad requerida del ingrediente (puede ser null).
 * @property {string} unit - Unidad de medida (ej: "g", "tbsp").
 * @property {string} description - Descripción del ingrediente.
 */

/**
 * @typedef {Object} Recipe
 * @property {string} id - Identificador único de la receta.
 * @property {string} imageUrl - URL de la imagen de la receta.
 * @property {string} title - Título de la receta.
 * @property {number} cookingTime - Tiempo estimado de preparación (en minutos).
 * @property {number} servings - Número de porciones.
 * @property {Ingredient[]} ingredients - Lista de ingredientes.
 * @property {string} publisher - Autor o fuente que publicó la receta.
 * @property {string} sourceUrl - URL original de la receta.
 */

/**
 * Estado global de la aplicación.
 *
 * @type {{
 *   recipe: Recipe | {},
 *   search: Object,
 *   bookmarks: Object
 * }}
 */
let state = {
  recipe: {},
  search: searchService.state,
  bookmarks: [],
};

const isMarked = function (id) {
  return state.bookmarks.some((recipe) => recipe.id === id);
};

const setLocalStorage = (data) => {
  localStorage.setItem('recipes', JSON.stringify(data));
};

const formatData = (data) => {
  return {
    image_url: data.image,
    title: data.title,
    cooking_time: Number(data.prepTime),
    servings: Number(data.servings),
    ingredients: data['ingredients[]'].map((ing) => {
      const arr = ing.trim().split(' ');

      const quantity = parseFloat(arr[0]) || null;
      const unit = arr[1] || '';
      const description = arr.slice(2).join(' ') || '';

      return {
        quantity,
        unit,
        description,
      };
    }),
    publisher: data.publisher,
    source_url: data.sourceUrl,
  };
};

/**
 *
 * @param recipeData
 */
export async function uploadRecipe(recipeData) {
  try {
    const recipe = formatData(recipeData);
    console.log(recipe);

    const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes?key=${KEY_API}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);

    console.log('Receta creada:', data);
  } catch (err) {
    console.error('Error al crear receta:', err);
    throw err;
  }
}

/**
 * Loads a recipe from the API by its ID, normalizes the data, and updates the global state.
 *
 * @async
 * @function loadRecipe
 * @param {string} id - ID of the recipe to load.
 * @param marked
 * @returns {Promise<Recipe>} The processed recipe stored in the state.
 *
 * @throws {Error} Throws an error if the HTTP request fails or if the API does not respond correctly.
 *
 * @description
 * Steps performed by the function:
 * 1. Requests the recipe from the `forkify` API.
 * 2. Validates that the HTTP response is correct.
 * 3. Extracts the data and transforms it into a consistent format.
 * 4. Updates `state.recipe` with the new recipe.
 * 5. Returns the formatted recipe.
 *
 * Normalization ensures consistency with the rest of the project.
 */
export const loadRecipe = async function (id) {
  try {
    const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);
    if (!res.ok) throw new Error('Error Connection');
    const { data } = await res.json();

    const recipe = {
      id: data.recipe.id,
      imageUrl: data.recipe.image_url,
      title: data.recipe.title,
      cookingTime: data.recipe.cooking_time,
      servings: data.recipe.servings,
      ingredients: data.recipe.ingredients,
      publisher: data.recipe.publisher,
      sourceUrl: data.recipe.source_url,
      isMarked: isMarked(id),
    };

    state.recipe = recipe;
    setLocalStorage(state);
    return state.recipe;
  } catch (error) {
    console.error('🚩Error while loading recipe:', error);
    throw error;
  }
};

export const updateServings = function (newServings) {
  const { servings: oldServings, ingredients } = state.recipe;

  const updatedIngredients = ingredients.map((ing) => ({
    ...ing,
    quantity: (ing.quantity * newServings) / oldServings,
  }));

  state.recipe.ingredients = updatedIngredients;
  state.recipe.servings = newServings;

  setLocalStorage(state);
  return updatedIngredients;
};

export const addRecipeBookmarks = function (marked) {
  const idLoadedRecipe = state.recipe.id;
  state.search.recipes.forEach((recipe) => {
    if (recipe.id === idLoadedRecipe) state.bookmarks.push({ ...recipe, isMarked: marked });
  });
  setLocalStorage(state);
  return state.bookmarks;
};

export const removeRecipeBookmarks = function () {
  const idLoadedRecipe = state.recipe.id;

  const index = state.bookmarks.findIndex((recipe) => recipe.id === idLoadedRecipe);

  if (index !== -1) state.bookmarks.splice(index, 1);
  setLocalStorage(state);
  return state.bookmarks;
};

export const getLocalStorage = () => {
  const data = localStorage.getItem('recipes');
  if (!data) return;
  state = JSON.parse(data);

  searchService.state = state.search;

  return state;
};
