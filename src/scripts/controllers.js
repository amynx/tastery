import { loadRecipe } from './model.js';
import recipeView from './views/recipeView.js';
import { createIcons, icons } from 'lucide';

const controlRecipe = async function (id) {
  try {
    recipeView.renderAlertLoadingState();
    // recipeView.renderSpinner();

    // cargar datos desde el módelo
    const data = await loadRecipe(id);

    /*Renderizar alerta*/
    await recipeView.hideAlertLoadingState();
    await recipeView.renderAlert('success');

    /*Renderizar receta*/
    recipeView.render(data);

    createIcons({ icons });
  } catch (error) {
    await recipeView.hideAlertLoadingState();
    await recipeView.renderAlert('error');
    console.error(error);
  }
};

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
