/**
 * @module model
 * @description
 * Module responsible for managing and storing the global state of the application.
 * Includes functions for loading recipes from the external API and normalizing data.
 */

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
const state = {
  recipe: {},
  search: {
    query: '',
    recipes: [],
    totalPage: null,
    currentPage: 1,
  },
  bookmarks: {},
};

/**
 * Loads a recipe from the API by its ID, normalizes the data, and updates the global state.
 *
 * @async
 * @function loadRecipe
 * @param {string} id - ID of the recipe to load.
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
    };

    state.recipe = recipe;
    return state.recipe;
  } catch (error) {
    console.error('🚩Error while loading recipe:', error);
    throw error;
  }
};

/*
Solcitud con validaciones 
Páginacion (Cortar arreglo de recetas en base al numero de pagina)
Formatear datos
Actualizar estado de Busqueda 
*/

const formatSearchResultData = function (data) {
  return data.map((recipe) => {
    return {
      id: recipe.id,
      imageUrl: recipe.image_url,
      title: recipe.title,
      publisher: recipe.publisher,
    };
  });
};

const getPage = function (recipes) {
  const start = (state.search.currentPage - 1) * 6;
  const end = start + 6;
  const page = recipes.slice(start, end);
  return page;
};

const getRecipes = async function (query) {
  const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/?search=${query}`);
  if (!res.ok) throw new Error('Error Connection');
  const { data } = await res.json();
  if (!data.recipes.length) throw new Error('info');
  return data;
};

export const updatePage = async function (currentPage) {
  state.search.currentPage = currentPage;
  const data = await getRecipes(state.search.query);
  const recipes = getPage(data.recipes);
  const recipesFormat = formatSearchResultData(recipes);

  // Actualizar estado
  state.search.recipes = recipesFormat;
  return state.search;
};

export const loadSearchResults = async function (query = state.search.query) {
  try {
    // Actualizar estado
    //state.search.currentPage = currentPage;
    state.search.query = query;

    // hacer solicutud
    const data = await getRecipes(query);
    console.log(data);

    // cargar numero de paginas
    state.search.totalPage = Math.ceil(data.recipes.length / 6);
    console.log(Math.ceil(data.recipes.length / 6));

    const recipes = getPage(data.recipes);
    const recipesFormat = formatSearchResultData(recipes);

    // Actualizar estado
    state.search.recipes = recipesFormat;
    return state.search;
  } catch (error) {
    console.error('🚩Error while loading recipe:', error);
    throw error;
  }
};
