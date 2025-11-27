/**
 *
 */
class View {
  /**
   * @property {_spinnerParentElement}
   * @type {HTMLElement}
   * @private
   * @description Contenedor donde se muestra el spinner de carga.
   */

  /**
   * @property {_alertParentElement}
   * @type {HTMLElement}
   * @private
   * @description Contenedor superior donde se muestran alertas animadas.
   */

  /**
   * @property {_typeAlert}
   * @type {Object<string, {title: string, description: string}>}
   * @private
   * @description Configuración de títulos y descripciones para cada tipo de alerta.
   */

  /**
   * @property {_activeTimeout}
   * @type {number | null}
   * @private
   * @description ID del timeout activo para ocultar alertas automáticamente.
   */

  /**
   * @property {_isAnimating}
   * @type {boolean}
   * @private
   * @description Indica si una alerta está actualmente en animación para evitar conflictos.
   */
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

  // ---------------------------------------------------------------------------
  // PUBLIC METHODS
  // ---------------------------------------------------------------------------

  /**
   * Renders the “loading” alert state.
   *
   * @public
   * @returns {void}
   * @description
   * Shows the user a visual notification that the system is retrieving data.
   * Cancels any previous alerts before rendering a new one.
   */
  renderAlertLoadingState = () => {
    this._clearAlert(); // Cancela cualquier animación o timeout activo
    const markup = this._generateMarkupAlertLoadingState();
    this._alertParentElement.innerHTML = markup;
    this._showAlert();
  };

  /**
   * Hides the loading alert using an animation.
   *
   * @async
   * @public
   * @returns {Promise<void>}
   * @description
   * Runs a fade-out animation before clearing the container.
   */
  hideAlertLoadingState = async () => {
    await this._fadeOut();
    this._clearAlert();
  };

  /**
   * Renderiza una alerta del tipo especificado.
   *
   * @async
   * @public
   * @param {"success"|"info"|"error"} typeAlert - Tipo de alerta a mostrar.
   * @returns {Promise<void>}
   * @description
   * Renderiza la alerta, ejecuta fade-in y programa su auto-ocultamiento
   * a los 5 segundos. Cualquier alerta previa se cancela.
   */
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
   * Renders a loading spinner in the recipe view.
   *
   * @public
   * @returns {void}
   */
  renderSpinner = () => {
    this._spinnerParentElement.classList.remove('hidden');
    this._parentElement.innerHTML = '';
    this._parentElement.appendChild(this._spinnerParentElement);
  };

  /**
   * Completely renders the data from a recipe.
   *
   * @public
   * @param {Object} data - Formatted data from the model.
   * @returns {void}
   * @description Clears the main container and generates dynamic HTML.
   */
  render = (data) => {
    this._data = data;
    const markup = this._generateMarkup();
    this._parentElement.innerHTML = markup;
  };

  /**
   * Visually displays the alert container.
   *
   * @private
   * @returns {void}
   */
  _showAlert() {
    this._alertParentElement.classList.remove('hidden');
    this._alertParentElement.classList.add('animate-fadeIn');
  }

  /**
   * Executes visual entry effect (fade-in).
   *
   * @async
   * @private
   * @returns {Promise<void>}
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
   * Executes visual fade-out effect.
   *
   * @async
   * @private
   * @returns {Promise<void>}
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
   * Waits for the CSS animation to finish.
   *
   * @private
   * @returns {Promise<void>}
   */
  async _waitForAnimationEnd() {
    return new Promise((resolve) => {
      this._alertParentElement.addEventListener('animationend', () => resolve(), {
        once: true,
      });
    });
  }

  /**
   * Clears animation states, timeouts, and alert container content.
   *
   * @private
   * @returns {void}
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

  /**
   * Generates the HTML for an alert based on its type.
   *
   * @private
   * @param {“success”|"info"|“error”} type
   * @returns {string}
   */
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

  /**
   * Generates the HTML for the loading status.
   *
   * @private
   * @returns {string}
   */
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

export default View;
