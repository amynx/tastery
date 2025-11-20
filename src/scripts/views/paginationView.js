import View from './View';

/**
 *
 */
class paginationView extends View {
  _data;
  _parentElement = document.getElementById('pagination-controls');

  addHandlerChangePage = (handler) => {
    this._parentElement.addEventListener('click', (e) => {
      console.log(this._data);

      const element = e.target;
      if (!element.classList.contains('join-item')) return;

      if (element.ariaLabel === 'Previous page') {
        return handler(this._data.currentPage - 1);
      }

      if (element.ariaLabel === 'Next page') {
        return handler(this._data.currentPage + 1);
      }
    });
  };

  _generateMarkup = () => {
    if (this._data.totalPages === 1) {
      return `
         <div id="pagination-container" class="join">
            <button class="join-item btn btn-outline">${this._data.currentPage}</button>
          </-div>
    `;
    }

    if (this._data.currentPage === this._data.totalPages) {
      return `
         <div id="pagination-container" class="join">
            <button class="join-item btn btn-outline" aria-label="Previous page">«</button>
            <button class="join-item btn btn-outline">${this._data.currentPage}</button>
        </-div>
    `;
    }

    if (this._data.currentPage > 1) {
      return `
         <div id="pagination-container" class="join">
            <button class="join-item btn btn-outline" aria-label="Previous page">«</button>
            <button class="join-item btn btn-outline">${this._data.currentPage}</button>
            <button class="join-item btn btn-outline" aria-label="Next page">»</button>
          </-div>
    `;
    }

    if (this._data.totalPages > 1) {
      return `
         <div id="pagination-container" class="join">
            <button class="join-item btn btn-outline">${this._data.currentPage}</button>
            <button class="join-item btn btn-outline" aria-label="Next page">»</button>
          </-div>
    `;
    }
  };
}

export default new paginationView();
