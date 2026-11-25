// index.html: list of recipes with search, category filter and sort

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const sortSelect = document.getElementById('sort');
const resultsCount = document.getElementById('results-count');
const recipesGrid = document.getElementById('recipes-grid');
const emptyState = document.getElementById('empty-state');

// What the user has chosen so far
let search = '';
let category = 'all';
let sort = sortSelect.value;

// Used to ignore an old answer when a newer request was already sent
let lastRequest = 0;

// Mark the chip of the chosen category as active (and no other)
function setActiveChip(chosenCategory) {
  const chips = categoryFilter.querySelectorAll('.chip');
  for (const chip of chips) {
    chip.classList.toggle('is-active', chip.dataset.category === chosenCategory);
  }
}

// Show the recipes (or the "nothing found" message) on the page
function showRecipes(recipes) {
  let cards = '';
  for (const recipe of recipes) {
    cards += buildRecipeCard(recipe);
  }
  recipesGrid.innerHTML = cards;

  if (recipes.length === 1) {
    resultsCount.textContent = 'Showing 1 recipe';
  } else {
    resultsCount.textContent = 'Showing ' + recipes.length + ' recipes';
  }

  // The "hidden" attribute hides the message, so hide it only when there are recipes
  emptyState.hidden = recipes.length > 0;
}

// Ask the server for the recipes that match the search, category and sort
async function loadRecipes() {
  lastRequest = lastRequest + 1;
  const thisRequest = lastRequest;

  const params = new URLSearchParams();
  if (search !== '') {
    params.set('search', search);
  }
  if (category !== 'all') {
    params.set('category', category);
  }
  params.set('sort', sort);

  try {
    const recipes = await apiGet(API + '?' + params.toString());

    // A newer request was sent meanwhile: ignore this old answer
    if (thisRequest !== lastRequest) {
      return;
    }
    showRecipes(recipes);
  } catch (error) {
    if (thisRequest !== lastRequest) {
      return;
    }
    recipesGrid.innerHTML = '';
    emptyState.hidden = true;
    resultsCount.textContent = 'Could not load the recipes. Is the server running?';
  }
}

// Search: the form was sent
searchForm.addEventListener('submit', function (event) {
  event.preventDefault();
  search = searchInput.value.trim();
  loadRecipes();
});

// Category chips: one click on a chip
categoryFilter.addEventListener('click', function (event) {
  const chip = event.target.closest('.chip');
  if (!chip) {
    return;
  }
  category = chip.dataset.category;
  setActiveChip(category);
  loadRecipes();
});

// Sort: another option was chosen
sortSelect.addEventListener('change', function () {
  sort = sortSelect.value;
  loadRecipes();
});

// When the page opens, use ?category= and ?search= from the address
// (the Categories page links to index.html?category=soups)
const addressParams = new URLSearchParams(window.location.search);

if (addressParams.get('category')) {
  category = addressParams.get('category');
  setActiveChip(category);
}

if (addressParams.get('search')) {
  search = addressParams.get('search').trim();
  searchInput.value = search;
}

loadRecipes();
