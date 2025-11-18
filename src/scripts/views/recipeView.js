import View from './View.js';

/**
 * @class recipeView
 * @classdesc
 * View responsible for rendering recipes, alerts, and loading states within
 * the interface.
 *
 * Manages:
 * - Main rendering of the recipe
 * - Animated alerts (success, info, error)
 * - Loading states
 * - Entry and exit animations
 *
 * This class must be used through its imported instance.
 */
class recipeView extends View {
  /**
   * @property {_data} _data
   * @type {Object | null}
   * @private
   * @description Guarda los datos actuales de la receta renderizada.
   */

  /**
   * @property {_parentElment}
   * @type {HTMLElement}
   * @private
   * @description Contenedor donde se renderiza la receta completa.
   */

  _data;
  _parentElement = document.getElementById('recipe-detail');

  /**
   * Generates the HTML for the complete recipe.
   *
   * @private
   * @returns {string}
   * @description Returns the complete recipe markup (image, meta, ingredients, author, etc.).
   */
  _generateMarkup = () => {
    return `
      <article id="recipe-content" class="flex flex-col gap-8" aria-live="polite">
          <!-- ======================== IMAGE & TITLE ======================== -->
          <!-- @element RecipeHeader -->
          <!-- @description
        Displays the recipe image and main title of the selected dish.
      -->
          <header class="flex flex-col items-center text-center gap-4 w-full">
            <figure class="w-full h-[40vh] rounded-xl overflow-hidden">
              <img
                src="${this._data.imageUrl}"
                alt="Image of the selected recipe"
                class="w-full h-full object-cover object-center"
              />
            </figure>
            <h1
              id="recipe-title"
              class="text-3xl font-bold text-base-content text-center uppercase"
            >
              ${this._data.title}
            </h1>
          </header>

          <!-- ======================== META & ACTIONS ======================== -->
          <!-- @element RecipeMeta -->
          <!-- @description
        Displays cooking time, serving controls, and a save recipe button.
      -->
          <div class="flex flex-col md:flex-row justify-between items-center gap-4 border-b pb-4">
            <!-- Cooking time -->
            <div class="flex items-center gap-2">
              <i data-lucide="clock" class="w-5 h-5 text-primary"></i>
              <span class="text-base font-medium uppercase">${this._data.cookingTime} MINUTES</span>
            </div>

            <!-- Serving controls -->
            <div class="flex items-center gap-3">
              <label
                for="servings"
                class="font-semibold text-base-content uppercase"
                aria-label="Servings quantity"
              >
                SERVINGS
              </label>
              <div class="join">
                <button class="btn btn-sm join-item" aria-label="Decrease servings">
                  <i data-lucide="minus" class="w-4 h-4"></i>
                </button>
                <input
                  id="servings"
                  type="number"
                  value="${this._data.servings}"
                  min="1"
                  class="input input-sm join-item text-center w-16"
                  aria-live="polite"
                />
                <button class="btn btn-sm join-item" aria-label="Increase servings">
                  <i data-lucide="plus" class="w-4 h-4"></i>
                </button>
              </div>
            </div>

            <!-- Save recipe button -->
            <div>
              <button
                id="save-recipe-btn"
                class="btn btn-outline btn-primary gap-2 uppercase"
                aria-pressed="false"
                aria-label="Save recipe"
              >
                <i data-lucide="bookmark" class="w-5 h-5"></i>
                SAVE RECIPE
              </button>
            </div>
          </div>

          <!-- ======================== INGREDIENTS LIST ======================== -->
          <!-- @element IngredientsList -->
          <!-- @description
        Displays all ingredients for the recipe in two columns on large screens.
      -->
          <section aria-labelledby="ingredients-title" class="flex flex-col items-center gap-4">
            <h2
              id="ingredients-title"
              class="text-2xl font-semibold text-base-content text-center uppercase"
            >
              RECIPE INGREDIENTS
            </h2>

            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none" role="list">
              ${this._data.ingredients
                .map((ing) => {
                  return `<li class="flex items-center gap-3">
                    <i data-lucide="check" class="w-5 h-5 text-success"></i>
                    <span class="capitalize">${ing.quantity ? ing.quantity : ''} ${ing.unit} ${ing.description}Flour</span>
                  </li>`;
                })
                .join(' ')}
            </ul>
          </section>

          <!-- ======================== AUTHOR INFO ======================== -->
          <!-- @element RecipeAuthor -->
          <!-- @description
        Displays author information and link to external website.
      -->
          <footer
            class="border-t pt-4 flex flex-col items-center gap-3"
            aria-labelledby="author-title"
          >
            <h3
              id="author-title"
              class="text-xl font-semibold text-base-content text-center uppercase"
            >
              HOW TO COOK IT
            </h3>
            <p class="text-center text-base text-base-content/80 capitalize">
              This recipe was carefully designed and tested by <strong>${this._data.publisher}</strong>. Please check out directions at their website.
            </p>
            <a
              href="${this._data.sourceUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm btn-secondary flex items-center gap-2"
              aria-label="Visit author website"
            >
              <i data-lucide="external-link" class="w-4 h-4"></i>
              VISIT WEBSITE
            </a>
          </footer> 
        </article>
    `;
  };
}

export default new recipeView();
