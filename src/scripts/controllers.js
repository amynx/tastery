/**
 * @module controller/recipeController
 * @description
 * Main controller responsible for managing the flow of loading and displaying
 * recipes. This module listens for changes in the URL (hash) and coordinates the
 * retrieval of data from the model as well as the rendering in the view.
 *
 * Responsibilities:
 * - Listen for changes in the URL hash.
 * - Request data from the model (`loadRecipe`).
 * - Manage loading states, success, or error using `recipeView`.
 * - Render SVG icons with `lucide`.
 */

import { loadRecipe } from './model.js';
import recipeView from './views/recipeView.js';
import { createIcons, icons } from 'lucide';

/**
 * Controls the process of fetching and rendering a recipe.
 *
 * @async
 * @function controlRecipe
 * @param {string} id - The recipe ID, extracted from the URL hash.
 * @returns {Promise<void>} Does not return a value; updates the view as a side effect.
 *
 * @description
 * Executes all the steps necessary to display a recipe:
 * 1. Displays a loading state.
 * 2. Obtains the recipe from the model.
 * 3. Notifies the user with visual alerts.
 * 4. Renders the recipe on screen.
 * 5. Updates the SVG icons using Lucide.
 *
 * In case of error, an error alert is displayed and logged to the console.
 */
const controlRecipe = async function (id) {
  try {
    // Render status alerts
    recipeView.renderAlertLoadingState();
    // recipeView.renderSpinner();

    // Load data from the model
    const data = await loadRecipe(id);

    // Render status alerts
    await recipeView.hideAlertLoadingState();
    await recipeView.renderAlert('success');

    // Render recipe
    recipeView.render(data);

    // Render SVG icons
    createIcons({ icons });
  } catch (error) {
    await recipeView.hideAlertLoadingState();
    await recipeView.renderAlert('error');
    console.error(error);
  }
};

/**
 * Initializes the module by registering the necessary listeners to handle
 * the initial load and changes in the URL (`hashchange` event).
 *
 * @function init
 * @returns {void}
 *
 * @description
 * Observes the `load` and `hashchange` events on `window`.
 * Each time the URL changes or the page loads, the recipe ID is obtained from
 * the hash (`#id`) and `controlRecipe` is executed.
 *
 * If there is no ID in the hash, nothing is executed.
 */
export const init = function () {
  const events = ['load', 'hashchange'];
  events.forEach((e) =>
    window.addEventListener(e, () => {
      const recipeId = window.location.hash;
      if (!recipeId) return;
      controlRecipe(recipeId.slice(1));
    })
  );
};
