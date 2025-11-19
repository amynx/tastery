import View from './View';

/**
 *
 */
class paginationView extends View {
  _data;
  _parentElement = document.getElementById('pagination-controls');

  addHandlerChangePage = (handler) => {
    this._parentElement.addEventListener('click', (e) => {
      const element = e.target;
      if (!element.classList.contains('join-item')) return;
      console.log(this._data);

      if (element.ariaLabel === 'Previous page') {
        return handler(this._data - 1);
      }

      if (element.ariaLabel === 'Next page') {
        return handler(this._data + 1);
      }

      const currentPage = parseInt(element.innerHTML);

      handler(currentPage);
    });
  };

  _generateMarkup = () => {
    return `
         <div id="pagination-container" class="join">
            <button class="join-item btn btn-outline" aria-label="Previous page">«</button>
            <button class="join-item btn btn-outline">${this._data}</button>
            <button class="join-item btn btn-outline" aria-label="Next page">»</button>
          </-div>
    `;
  };
}

export default new paginationView();

/*
numero de pagina actual 
Click Next page -> paginaActual + 1
hacer solictud
renderizar resultados 


Actualizo numero de pagina 
Previous page -> paginaActual - 1
Actualizo numero de pagina 
*/
