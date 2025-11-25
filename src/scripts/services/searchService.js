import { RESULTS_PER_PAGE } from '../config.js';
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

  /**
   *
   * @param recipes
   */
  format(recipes) {
    return recipes.map(({ id, image_url, title, publisher }) => ({
      id,
      imageUrl: image_url,
      title,
      publisher,
    }));
  }

  /**
   *
   * @param query
   */
  async fetchRecipes(query) {
    const res = await fetch(`${this.apiBaseUrl}/recipes/?search=${query}`);

    if (!res.ok) throw new Error('Error Connection');

    const { data } = await res.json();

    if (!data.recipes.length) {
      throw new Error('info'); // mensaje de "no results"
    }

    return data.recipes;
  }

  /**
   *
   * @param query
   */
  async search(query) {
    this.state.query = query;
    this.state.currentPage = 1;

    const allRecipes = await this.fetchRecipes(query);

    this.state.totalPages = Math.ceil(allRecipes.length / RESULTS_PER_PAGE);

    const pageRecipes = this.paginate(allRecipes, 1);
    this.state.recipes = this.format(pageRecipes);

    return this.state;
  }

  /**
   *
   * @param pageNumber
   */
  async goToPage(pageNumber = this.state.currentPage) {
    this.state.currentPage = pageNumber;

    const allRecipes = await this.fetchRecipes(this.state.query);

    const pageRecipes = this.paginate(allRecipes, pageNumber);
    this.state.recipes = this.format(pageRecipes);

    return this.state;
  }
}
