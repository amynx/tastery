import View from './View.js';
/**
 *
 */
class searchView extends View {
  _data;
  _parentElement = document.getElementById('results-grid');
  _form = document.getElementById('primary-search-form');
  _input = document.getElementById('input-search-form');
  
  // Mobile elements
  _mobileForm = document.getElementById('mobile-search-form');
  _mobileInput = this._mobileForm?.querySelector('input');
  _btnOpenSearch = document.getElementById('btn-open-search');
  _btnCloseSearch = document.getElementById('btn-close-search');
  _searchResultsSection = document.getElementById('search-results-grid');

  _typeAlert = {
    success: {
      title: 'Recipes found!',
      description:
        'We’ve found delicious recipes based on your ingredient. Enjoy exploring the options!',
    },
    info: {
      title: 'No recipes found for that ingredient',
      description:
        'Try using a different ingredient or refining your search to discover more recipe options.',
    },
    error: {
      title: 'Unable to search for recipes!',
      description: `It seems there was an issue connecting to the server. Please try again or check your internet connection.`,
    },
  };
  _markupIndicator = `
       <div
              class="indicator absolute top-2 right-8 pointer-events-none"
              aria-hidden="true"
            >
              <span
                class="indicator-item badge badge-primary text-[11px] font-semibold shadow-md"
                role="status"
              >
                Selected
              </span>
            </div>
    `;

  /**
   *
   */
  constructor() {
    super();

    this._parentElement.addEventListener('click', (e) => {
      // Obtengo todas las cards
      const cards = this._parentElement.querySelectorAll('#card-item');

      // Retiro indicator de todas las cards si existe
      cards.forEach((card) => {
        const indicatorElement = card.querySelector('.indicator');
        if (indicatorElement) indicatorElement.remove();
      });

      // Encuentro la card cliqueada (su <a> padre)
      const cardElement = e.target.closest('#card-item');
      if (!cardElement) return; // click fuera de una card

      // Inserto indicator en la card cliqueada
      cardElement.insertAdjacentHTML('afterbegin', this._markupIndicator);
      
      // On mobile, close the modal when a result is clicked
      if (window.innerWidth < 1024) {
        this._closeMobileSearch();
      }
    });

    // Mobile Search Modal Events
    if (this._btnOpenSearch) {
      this._btnOpenSearch.addEventListener('click', this._openMobileSearch.bind(this));
    }
    if (this._btnCloseSearch) {
      this._btnCloseSearch.addEventListener('click', this._closeMobileSearch.bind(this));
    }
  }

  _openMobileSearch() {
    this._searchResultsSection.classList.remove('hidden');
    this._searchResultsSection.classList.add('fixed', 'inset-0', 'z-50', 'w-full', 'h-full', 'flex');
    // Focus mobile input
    setTimeout(() => this._mobileInput?.focus(), 100);
  }

  _closeMobileSearch() {
    this._searchResultsSection.classList.add('hidden');
    this._searchResultsSection.classList.remove('fixed', 'inset-0', 'z-50', 'w-full', 'h-full', 'flex');
  }

  // ---------------------------------------------------------------------------
  // PUBLIC METHODS
  // ---------------------------------------------------------------------------

  addHandlerRender = (handler) => {
    // Desktop Form
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = this._input.value;
      if (!query) {
        this._input.value = '';
        return;
      }
      this._input.value = '';
      handler(query);
    });

    // Mobile Form
    if (this._mobileForm) {
      this._mobileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = this._mobileInput.value;
        if (!query) {
          this._mobileInput.value = '';
          return;
        }
        this._mobileInput.value = '';
        // Also clear desktop input to stay in sync if needed, or just run handler
        handler(query);
      });
    }
  };

  _generateMarkup = () => {
    const markup = this._data
      .map((recipe) => {
        return `
            <a
              id="card-item"
              href="#${recipe.id}"
              class="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 w-full cursor-pointer"
              role="listitem"
            >
              <div class="card-body flex flex-row items-center gap-4 p-4">
                <!-- Thumbnail -->
                <figure class="shrink-0">
                  <img
                    src="${recipe.imageUrl}"
                    alt="Result thumbnail"
                    class="rounded-full w-16 h-16 object-cover"
                    loading="lazy"
                  />
                </figure>
  
                <!-- Text Content -->
                <div class="flex flex-col justify-center">
                  <h2 class="card-title text-base font-semibold uppercase line-clamp-2">
                    ${recipe.title}
                  </h2>
                  <p class="text-sm text-gray-500 capitalize">${recipe.publisher}</p>
                </div>
              </div>
            </a>
        `;
      })
      .join(' ');

    return markup;
  };
}

export default new searchView();
