import View from './View';

/**
 *
 */
class formView extends View {
  /**
   *
   * @param parameters
   */
  _data;
  _parentElement = document.getElementById('addRecipeModal');
  _form = document.getElementById('form');
  _overlayElement = document.querySelector('.modal-backdrop');
  _btnAddRecipe = document.getElementById('btn-add-recipe');
  _btnCloseForm = document.getElementById('btn-close-form');
  _btnSubmitForm = document.getElementById('btn-submit-form');

  /**
   *
   */
  constructor() {
    super();
    const events = [this._overlayElement, this._btnCloseForm];
    events.forEach((e) => {
      e.addEventListener('click', () => {
        this._parentElement.classList.add('hidden');
      });
    });
  }

  addHandlerAddRecipe = () => {
    this._btnAddRecipe.addEventListener('click', () => {
      this._parentElement.classList.remove('hidden');
    });
  };

  addHandlerSubmit = (handler) => {
    this._form.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(this._form);
      const data = {};

      formData.forEach((value, key) => {
        if (key.endsWith('[]')) {
          // si es array
          if (!data[key]) data[key] = [];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });

      return handler(data);
    });
  };
}

export default new formView();
