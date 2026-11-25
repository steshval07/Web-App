// recipe-details.html: one recipe

const recipeHero = document.querySelector('.recipe-hero');
const recipeBody = document.querySelector('.recipe-body').closest('section');
const notFoundSection = document.getElementById('recipe-not-found');
const recipePhoto = document.getElementById('recipe-photo');
const confirmDeleteButton = document.getElementById('confirm-delete');

// The id of the recipe is in the address: recipe-details.html?id=3
const recipeId = new URLSearchParams(window.location.search).get('id');

// Hide the recipe and show the "Recipe not found" block
// (title and text are optional, to reuse the block for other problems)
function showNotFound(title, text) {
  recipeHero.hidden = true;
  recipeBody.hidden = true;
  notFoundSection.hidden = false;

  if (title) {
    notFoundSection.querySelector('.empty-state__title').textContent = title;
  }
  if (text) {
    notFoundSection.querySelector('.empty-state__text').textContent = text;
  }
}

// Put the recipe data into the page
function showRecipe(recipe) {
  document.title = recipe.title + ' — Mise.';

  const categoryName = capitalize(recipe.category);

  // Breadcrumb and headings
  const crumbCategory = document.getElementById('crumb-category');
  crumbCategory.textContent = categoryName;
  crumbCategory.href = 'index.html?category=' + encodeURIComponent(recipe.category);
  document.getElementById('crumb-title').textContent = recipe.title;
  document.getElementById('recipe-category').textContent = categoryName;
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-description').textContent = recipe.description || '';
  document.getElementById('edit-link').href = 'add-recipe.html?id=' + recipe.id;

  // Photo: the box gets the colour of the category, the picture only if there is a link
  recipePhoto.parentElement.className = 'photo photo--' + photoTone(recipe.category);
  if (recipe.photo_url) {
    recipePhoto.src = recipe.photo_url;
    recipePhoto.alt = recipe.title;
    recipePhoto.hidden = false;
  } else {
    recipePhoto.hidden = true;
  }

  // The four boxes: time, servings, difficulty, category
  document.getElementById('recipe-time').textContent = formatTime(recipe.time_minutes);
  document.getElementById('recipe-servings').textContent = recipe.servings;
  document.getElementById('recipe-difficulty').textContent = capitalize(recipe.difficulty);
  document.getElementById('recipe-category-stat').textContent = categoryName;

  // Ingredients: one per line, written as "Name - amount"
  const ingredients = splitLines(recipe.ingredients);
  let ingredientsHtml = '';
  for (const line of ingredients) {
    let name = line;
    let amount = '';
    const dash = line.indexOf(' - ');
    if (dash !== -1) {
      name = line.slice(0, dash);
      amount = line.slice(dash + 3);
    }
    ingredientsHtml +=
      '<li><label class="ingredient"><input type="checkbox">' +
      '<span class="ingredient__name">' + escapeHtml(name) + '</span>' +
      '<span class="ingredient__qty">' + escapeHtml(amount) + '</span></label></li>';
  }
  document.getElementById('ingredient-list').innerHTML = ingredientsHtml;

  if (ingredients.length === 1) {
    document.getElementById('ingredient-count').textContent = '1 item';
  } else {
    document.getElementById('ingredient-count').textContent = ingredients.length + ' items';
  }

  // Steps: one per line
  let stepsHtml = '';
  for (const line of splitLines(recipe.steps)) {
    stepsHtml += '<li class="step"><div><p class="step__text">' + escapeHtml(line) + '</p></div></li>';
  }
  document.getElementById('steps-list').innerHTML = stepsHtml;

  // The name inside the "Delete this recipe?" window
  document.getElementById('delete-recipe-name').textContent = recipe.title;
}

// Load the recipe from the server
async function loadRecipe() {
  if (!recipeId) {
    showNotFound();
    return;
  }

  try {
    const recipe = await apiGet(API + '/' + encodeURIComponent(recipeId));
    showRecipe(recipe);
  } catch (error) {
    if (error.status === 404) {
      showNotFound();
    } else {
      showNotFound('Could not load the recipe', 'Check that the server is running and try again.');
    }
  }
}

// Delete: the user clicked "Delete recipe" inside the window
confirmDeleteButton.addEventListener('click', async function () {
  confirmDeleteButton.disabled = true;

  try {
    await apiSend('DELETE', API + '/' + encodeURIComponent(recipeId));
    window.location.href = 'index.html';
  } catch (error) {
    confirmDeleteButton.disabled = false;
    alert('Could not delete the recipe. Please try again.');
  }
});

loadRecipe();