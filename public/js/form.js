// add-recipe.html: add a new recipe or edit an existing one

const recipeForm = document.getElementById('recipe-form');
const formTitle = document.getElementById('form-title');
const formError = document.getElementById('form-error');
const saveButton = recipeForm.querySelector('button[type="submit"]');

// If the address has ?id=3 we are editing recipe 3, otherwise we add a new recipe
const editId = new URLSearchParams(window.location.search).get('id');

// Show the red box at the top of the form with a title and a text
function showFormMessage(title, text) {
  formError.querySelector('div').innerHTML = '<strong>' + escapeHtml(title) + '</strong><br>' + escapeHtml(text);
  formError.hidden = false;
}

// Remove all red errors from the form
function clearErrors() {
  const invalidFields = recipeForm.querySelectorAll('.field.is-invalid');
  for (const field of invalidFields) {
    field.classList.remove('is-invalid');
  }
  formError.hidden = true;
}

// Show an error under one field. "fieldName" is the name attribute, for example "title".
function showFieldError(fieldName, message) {
  const input = recipeForm.elements[fieldName];
  if (!input) {
    return;
  }
  const field = input.closest('.field');
  field.classList.add('is-invalid');

  // The message is the text after the icon inside .field__error
  const errorLine = field.querySelector('.field__error');
  if (errorLine && message) {
    errorLine.lastChild.textContent = message;
  }
}

// Show all errors at once: a list like { title: '...', servings: '...' }
function showErrors(errors) {
  for (const fieldName in errors) {
    showFieldError(fieldName, errors[fieldName]);
  }
  showFormMessage('Some fields need your attention.', 'Check the highlighted fields below and try again.');

  // Put the cursor in the first wrong field
  const firstInvalid = recipeForm.querySelector('.field.is-invalid');
  if (firstInvalid) {
    firstInvalid.querySelector('input, select, textarea').focus();
  }
}

// Read the form and return the recipe as an object (numbers as real numbers)
function readForm() {
  return {
    title: recipeForm.elements.title.value.trim(),
    description: recipeForm.elements.description.value.trim(),
    category: recipeForm.elements.category.value,
    time_minutes: Number(recipeForm.elements.time_minutes.value),
    servings: Number(recipeForm.elements.servings.value),
    difficulty: recipeForm.querySelector('input[name="difficulty"]:checked').value,
    photo_url: recipeForm.elements.photo_url.value.trim(),
    ingredients: recipeForm.elements.ingredients.value.trim(),
    steps: recipeForm.elements.steps.value.trim()
  };
}

// Check the recipe in the browser (the server checks it again with the same rules).
// Returns an object with one message per wrong field; empty object = all good.
function checkRecipe(recipe) {
  const errors = {};

  if (recipe.title.length < 3) {
    errors.title = 'Enter a recipe name (at least 3 characters).';
  }
  if (recipe.description.length > 200) {
    errors.description = 'Use at most 200 characters.';
  }
  if (recipe.category === '') {
    errors.category = 'Choose a category.';
  }
  if (!Number.isInteger(recipe.time_minutes) || recipe.time_minutes <= 0) {
    errors.time_minutes = 'Enter a number greater than 0.';
  }
  if (!Number.isInteger(recipe.servings) || recipe.servings <= 0) {
    errors.servings = 'Enter a number greater than 0.';
  }
  if (recipe.photo_url !== '' && !recipe.photo_url.startsWith('http://') && !recipe.photo_url.startsWith('https://')) {
    errors.photo_url = 'Enter a valid link that starts with https://';
  }
  if (recipe.ingredients === '') {
    errors.ingredients = 'Add at least one ingredient.';
  }
  if (recipe.steps === '') {
    errors.steps = 'Describe at least one step.';
  }

  return errors;
}

// Put the data of an existing recipe into the form (edit mode)
function fillForm(recipe) {
  recipeForm.elements.title.value = recipe.title;
  recipeForm.elements.description.value = recipe.description || '';
  recipeForm.elements.category.value = recipe.category;
  recipeForm.elements.time_minutes.value = recipe.time_minutes;
  recipeForm.elements.servings.value = recipe.servings;
  recipeForm.elements.photo_url.value = recipe.photo_url || '';
  recipeForm.elements.ingredients.value = recipe.ingredients;
  recipeForm.elements.steps.value = recipe.steps;

  const difficultyButtons = recipeForm.querySelectorAll('input[name="difficulty"]');
  for (const button of difficultyButtons) {
    button.checked = (button.value === recipe.difficulty);
  }
}

// Edit mode: change the texts of the page and load the recipe
async function startEditMode() {
  formTitle.textContent = 'Edit recipe';
  document.title = 'Edit recipe — Mise.';
  document.querySelector('.breadcrumbs span:last-child').textContent = 'Edit recipe';
  document.querySelector('.form-actions .btn--outline').href = 'recipe-details.html?id=' + encodeURIComponent(editId);

  try {
    const recipe = await apiGet(API + '/' + encodeURIComponent(editId));
    fillForm(recipe);
  } catch (error) {
    saveButton.disabled = true;
    if (error.status === 404) {
      showFormMessage('Recipe not found.', 'This recipe does not exist, so it cannot be edited.');
    } else {
      showFormMessage('Could not load the recipe.', 'Check that the server is running and try again.');
    }
  }
}

// The form was sent
recipeForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  clearErrors();

  const recipe = readForm();

  // First check in the browser
  const errors = checkRecipe(recipe);
  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  // Then send to the server: POST creates, PUT changes
  saveButton.disabled = true;
  try {
    let saved;
    if (editId) {
      saved = await apiSend('PUT', API + '/' + encodeURIComponent(editId), recipe);
    } else {
      saved = await apiSend('POST', API, recipe);
    }
    // Saved: open the recipe
    window.location.href = 'recipe-details.html?id=' + saved.id;
  } catch (error) {
    saveButton.disabled = false;
    if (error.status === 400 && error.body && error.body.errors) {
      // The server found problems the browser did not: show them
      showErrors(error.body.errors);
    } else {
      showFormMessage('Could not save the recipe.', 'Check that the server is running and try again.');
    }
  }
});

// When the user starts correcting a field, remove its red error
recipeForm.addEventListener('input', function (event) {
  const field = event.target.closest('.field');
  if (field) {
    field.classList.remove('is-invalid');
  }
});

if (editId) {
  startEditMode();
}