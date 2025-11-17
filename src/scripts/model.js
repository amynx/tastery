const state = {
  recipe: {},
  search: {},
  bookmarks: {},
};

export const loadRecipe = async function (id) {
  try {
    const res = await fetch(`https://forkify-api.jonas.io/api/v2/recipes/${id}`);
    if (!res.ok) throw new Error('Error Connection');
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

    state.recipe = recipe;
    return state.recipe;
  } catch (error) {
    console.error('🚩Error while loading recipe:', error);
    throw error;
  }
};
