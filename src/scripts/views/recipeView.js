/**
 *
 */
class recipeView {
  _data;
  _parentElment = document.getElementById('recipe-detail');
  _spinnerParentElement = document.getElementById('recipe-loading');
  _alertParentElement = document.getElementById('alert-notification');
  _typeAlert = {
    success: {
      title: 'Recipe ready!',
      description: 'The recipe has been displayed correctly. Enjoy exploring its details!',
    },
    info: {
      title: 'Recipe ready!',
      description: 'The recipe has been displayed correctly. Enjoy exploring its details!',
    },
    error: {
      title: 'We were unable to load the recipe!',
      description: `It appears there's a problem with the connection. Try refreshing the page or checking your internet connection.`,
    },
  };
  _activeTimeout = null;
  _isAnimating = false;

  // Renderiza el estado "cargando"
  renderAlertLoadingState = () => {
    this._clearAlert(); // Cancela cualquier animación o timeout activo
    const markup = this._generateMarkupAlertLoadingState();
    this._alertParentElement.innerHTML = markup;
    this._showAlert();
  };

  // Oculta el estado "cargando"
  hideAlertLoadingState = async () => {
    await this._fadeOut();
    this._clearAlert();
  };

  // Renderiza una alerta de tipo específico
  renderAlert = async (typeAlert) => {
    this._clearAlert(); // Asegura que no se solape con otra alerta

    const markup = this._generateMarkupAlert(typeAlert);
    this._alertParentElement.innerHTML = markup;
    await this._fadeIn();

    // Mantiene la alerta visible 5 s y luego la oculta
    this._activeTimeout = setTimeout(async () => {
      await this._fadeOut();
      this._clearAlert();
    }, 5000);
  };

  /**
   *
   */
  _showAlert() {
    this._alertParentElement.classList.remove('hidden');
    this._alertParentElement.classList.add('animate-fadeIn');
  }

  /**
   *
   */
  async _fadeIn() {
    this._alertParentElement.classList.remove('hidden');
    this._alertParentElement.classList.add('animate-fadeIn');
    this._isAnimating = true;

    await this._waitForAnimationEnd();
    this._alertParentElement.classList.remove('animate-fadeIn');
    this._isAnimating = false;
  }

  /**
   *
   */
  async _fadeOut() {
    if (this._isAnimating) return; // evita conflictos si ya está animando
    this._alertParentElement.classList.add('animate-fadeOut');
    this._isAnimating = true;

    await this._waitForAnimationEnd();
    this._alertParentElement.classList.add('hidden');
    this._alertParentElement.classList.remove('animate-fadeOut');
    this._isAnimating = false;
  }

  /**
   *
   */
  async _waitForAnimationEnd() {
    return new Promise((resolve) => {
      this._alertParentElement.addEventListener('animationend', () => resolve(), {
        once: true,
      });
    });
  }

  /**
   *
   */
  _clearAlert() {
    // Cancela timeout previo
    if (this._activeTimeout) {
      clearTimeout(this._activeTimeout);
      this._activeTimeout = null;
    }

    // Limpia clases y contenido
    this._alertParentElement.classList.remove('animate-fadeIn', 'animate-fadeOut');
    this._alertParentElement.classList.add('hidden');
    this._isAnimating = false;
  }

  renderSpinner = () => {
    this._spinner.classList.remove('hidden');
    this._parentElment.innerHTML = '';
    this._parentElment.appendChild(this._spinner);
  };

  render = (data) => {
    this._data = data;
    this._parentElment.innerHTML = '';
    const markup = this._generateMarkup();
    this._parentElment.insertAdjacentHTML('afterbegin', markup);
  };

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

  _generateMarkupAlert = (type) => {
    return `
     <article
        class="alert shadow-lg bg-base-100 border border-base-300 rounded-xl p-4 flex items-start gap-3"
      >
        <!-- ======================== ICON BLOCK ======================== -->
        <!-- @element AlertIcon -->
        <!-- @description
      The visual icon indicating the type of alert (success, error, info, or warning).
      This icon provides immediate context to the user about the nature of the message.
    -->
        <span class="text-${type} flex-shrink-0 mt-0.5" role="img" aria-label="${type} icon">
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
          <h2 class="font-semibold text-base-content text-sm md:text-base">${this._typeAlert[type]?.title}</h2>

          <!-- @element AlertDescription -->
          <!-- @description
        A short explanation giving more context about the alert message.
      -->
          <p class="text-sm text-base-content/70">${this._typeAlert[type]?.description}</p>
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
  };

  _generateMarkupAlertLoadingState = () => {
    return `
        <div
          class="alert shadow-lg bg-base-100 border border-base-300 rounded-xl p-4 flex items-center gap-3"
        >
          <span class="loading loading-spinner text-primary"></span>
          <p class="text-sm text-base-content/70">Processing your request...</p>
        </div>
    `;
  };
}

export default new recipeView();
