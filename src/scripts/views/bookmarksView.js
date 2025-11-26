import View from './View';

/**
 *
 */
class BookmarksView extends View {
  _data;
  _parentElement = document.getElementById('list-bookmarks');

  _generateMarkup = () => {
    const markup = this._data
      .map((recipe) => {
        return `
             <li class="w-full pt-2">
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
              </li>
        `;
      })
      .join('');

    return markup;
  };
}

export default new BookmarksView();
