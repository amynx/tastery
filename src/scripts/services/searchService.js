import { RESULTS_PER_PAGE, USER_ID_API, KEY_API  } from '../config.js';

/**
 *
 */
export default class SearchService {
  /**
   *
   * @param apiBaseUrl
   */
  constructor(apiBaseUrl) {
    this.apiBaseUrl = apiBaseUrl;

    // Estado interno del servicio
  this.state = {
  query: '',
  currentPage: 1,
  totalPages: 1,
  recipes: [],
  nextUrl: null,      
};

  }

  // --- Helpers --- //

  /**
   *
   * @param items
   * @param page
   * @param perPage
   */
  paginate(items, page = 1, perPage = RESULTS_PER_PAGE) {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }

 extractRecipeId (uri) {
  return uri.split("#recipe_")[1];
}

 randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

  /**
   *
   * @param recipes
   */
  format(recipes) {
    return recipes.map((recipe) => ({
      id: this.extractRecipeId(recipe.uri),
      imageUrl: recipe.image,
      title: recipe.label,
      cookingTime: recipe.totalTime || this.randomInRange(30, 60),
      servings: recipe.yield,
      ingredients: recipe.ingredients,
      publisher: recipe.source,
      sourceUrl: recipe.url,
    }));
  }

  /**
   *
   * @param query
   */
async fetchRecipes(url) {
  const res = await fetch(url, {
    headers: {
      'Edamam-Account-User': USER_ID_API,
    },
  });

  if (!res.ok) throw new Error('Error Connection');

  const data = await res.json();

  if (!data.hits || data.hits.length === 0) {
    throw new Error('info'); // No results
  }
  console.log("links:", data._links);

  return data;
}



  /**
   *
   * @param query
   */
async search(query) {
  this.state.query = query;
  this.state.currentPage = 1;

  const initialUrl = `${this.apiBaseUrl}?type=public&q=${query}&app_id=${USER_ID_API}&app_key=${KEY_API}`;

  const data = await this.fetchRecipes(initialUrl);

  const allRecipes = data.hits.map(hit => hit.recipe);

  // Guardar next page (si existe)
  this.state.nextUrl = data._links?.next?.href || null;

  // Reformatear
  const formatted = this.format(allRecipes);

  this.state.recipes = formatted;

  // Calcular páginas internas
  this.state.totalPages = Math.ceil(formatted.length / RESULTS_PER_PAGE);

  const firstPage = this.paginate(formatted, 1);

  return { state: this.state, recipes: firstPage };
}


async fetchNextPage() {
  if (!this.state.nextUrl) return null;

  const data = await this.fetchRecipes(this.state.nextUrl);

  const newRecipes = data.hits.map(hit => hit.recipe);

  // Guardar next real
  this.state.nextUrl = data._links?.next?.href || null;

  // Formatear
  const formatted = this.format(newRecipes);

  // Agregar recetas al estado
  this.state.recipes = [...this.state.recipes, ...formatted];

  // ⚠️ Recalcular totalPages bien
  this.state.totalPages = Math.ceil(
    this.state.recipes.length / RESULTS_PER_PAGE
  );

  return formatted;
}



  /**
   *
   * @param pageNumber
   */
goToPage(pageNumber = this.state.currentPage) {
  this.state.currentPage = pageNumber;

  const pageRecipes = this.paginate(this.state.recipes, pageNumber);

  return { state: this.state, recipes: pageRecipes };
}

}
