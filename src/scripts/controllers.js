import { createIcons, icons } from 'lucide';

const containerRecipeDetails = document.getElementById('recipe-detail');
const spinner = document.getElementById('recipe-loading');
const containerAlert = document.getElementById('alert-notification');

/**
 *
 * @param markup
 */
function showAlert(markup) {
  // Limpia clases previas
  containerAlert.innerHTML = '';
  containerAlert.insertAdjacentHTML('afterbegin', markup);
  containerAlert.classList.remove('hidden', 'animate-fadeOut');
  containerAlert.classList.add('animate-fadeIn');

  // Oculta después de 3 segundos
  setTimeout(() => {
    containerAlert.classList.remove('animate-fadeIn');
    containerAlert.classList.add('animate-fadeOut');

    // Espera el fin de la animación para ocultar
    containerAlert.addEventListener(
      'animationend',
      () => {
        containerAlert.classList.add('hidden');
      },
      { once: true }
    );
  }, 3000);
}

const renderSpinner = function () {
  spinner.classList.remove('hidden');
  containerRecipeDetails.innerHTML = '';
  containerRecipeDetails.appendChild(spinner);
};

const loadRecipe = async function (id) {
  try {
    console.log('Working...');
    renderSpinner();
    console.log(id);

    const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);

    if (!res.ok) return new Error('Error Conection');
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

    console.log('Render...');
    /*Renderizar receta*/
    containerRecipeDetails.innerHTML = '';
    const markup = `
      <article id="recipe-content" class="flex flex-col gap-8" aria-live="polite">
          <!-- ======================== IMAGE & TITLE ======================== -->
          <!-- @element RecipeHeader -->
          <!-- @description
        Displays the recipe image and main title of the selected dish.
      -->
          <header class="flex flex-col items-center text-center gap-4 w-full">
            <figure class="w-full h-[40vh] rounded-xl overflow-hidden">
              <img
                src="${recipe.imageUrl}"
                alt="Image of the selected recipe"
                class="w-full h-full object-cover object-center"
              />
            </figure>
            <h1
              id="recipe-title"
              class="text-3xl font-bold text-base-content text-center uppercase"
            >
              ${recipe.title}
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
              <span class="text-base font-medium uppercase">${recipe.cookingTime} MINUTES</span>
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
                  value="${recipe.servings}"
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
              ${recipe.ingredients
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
              This recipe was carefully designed and tested by <strong>${recipe.publisher}</strong>. Please check out directions at their website.
            </p>
            <a
              href="${recipe.sourceUrl}"
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

    const markupAlert = `
     <article
        class="alert shadow-lg bg-base-100 border border-base-300 rounded-xl p-4 flex items-start gap-3"
      >
        <!-- ======================== ICON BLOCK ======================== -->
        <!-- @element AlertIcon -->
        <!-- @description
      The visual icon indicating the type of alert (success, error, info, or warning).
      This icon provides immediate context to the user about the nature of the message.
    -->
        <span class="text-success flex-shrink-0 mt-0.5" role="img" aria-label="success icon">
          <!-- You can swap the icon below depending on the alert type -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>

        <!-- ======================== CONTENT BLOCK ======================== -->
        <!-- @element AlertContent -->
        <!-- @description
      Contains the textual elements of the alert including the title and description.
      It provides the core information for the user.
    -->
        <div class="flex flex-col gap-1">
          <!-- @element AlertTitle -->
          <!-- @description
        The concise title summarizing the purpose of the alert.
      -->
          <h2 class="font-semibold text-base-content text-sm md:text-base">Recipe ready!</h2>

          <!-- @element AlertDescription -->
          <!-- @description
        A short explanation giving more context about the alert message.
      -->
          <p class="text-sm text-base-content/70">The recipe has been displayed correctly. Enjoy exploring its details!</p>
        </div>

        <!-- ======================== CLOSE BUTTON ======================== -->
        <!-- @element CloseButton -->
        <!-- @description
      Provides an accessible way for the user to dismiss the alert manually.
      Visible only when the alert supports manual dismissal.
    -->
        <button
          type="button"
          class="btn btn-ghost btn-sm ml-auto text-base-content/60 hover:text-base-content"
          aria-label="Close alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </article>
    `;
    containerRecipeDetails.insertAdjacentHTML('afterbegin', markup);
    showAlert(markupAlert);
    createIcons({ icons });
  } catch (error) {
    console.log(error);
  }
};

export const init = function () {
  const events = ['load', 'hashchange'];
  events.forEach((e) =>
    window.addEventListener(e, () => {
      const recipeId = window.location.hash;
      if (!recipeId) return;
      loadRecipe(recipeId.slice(1));
    })
  );
};
