// Shared helpers, loaded on every page that talks to the server

// Address of the recipes API (same server as the website, so no host name needed)
const API = '/api/recipes';

// Send a request to the server and return the JSON answer.
// If the server answers with an error (400, 404, 500...), throw an Error that has
//   error.status - the status number, for example 404
//   error.body   - the JSON the server sent, for example { errors: { title: '...' } }
async function apiRequest(method, url, body) {
  const options = { method: method, headers: {} };

  // Only requests with data (POST, PUT) send a JSON body
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  let data = null;
  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    const requestError = new Error('Request failed with status ' + response.status);
    requestError.status = response.status;
    requestError.body = data;
    throw requestError;
  }

  return data;
}

// GET: read data
function apiGet(url) {
  return apiRequest('GET', url);
}

// POST, PUT or DELETE: send data (body is optional)
function apiSend(method, url, body) {
  return apiRequest(method, url, body);
}

// Make text safe before putting it into innerHTML.
// Recipes are typed by users, so "<" and ">" must not become real HTML.
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 35 -> "35 min", 120 -> "2 h", 90 -> "1 h 30"
function formatTime(minutes) {
  if (minutes < 60) {
    return minutes + ' min';
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (rest === 0) {
    return hours + ' h';
  }
  return hours + ' h ' + rest;
}

// "easy" -> "Easy", "soups" -> "Soups"
function capitalize(word) {
  const text = String(word || '');
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Split a text into lines: trim each line and drop the empty ones
function splitLines(text) {
  return String(text || '')
    .split('\n')
    .map(function (line) { return line.trim(); })
    .filter(function (line) { return line !== ''; });
}

// Background colour of the photo box for each category (used when a recipe has no photo)
function photoTone(category) {
  const tones = {
    breakfast: 'honey',
    soups: 'tomato',
    mains: 'sky',
    salads: 'sage',
    baking: 'wheat',
    desserts: 'plum'
  };
  return tones[category] || 'wheat';
}

// Build the HTML of one recipe card (same markup as the template in index.html)
function buildRecipeCard(recipe) {
  let photo = '';
  if (recipe.photo_url) {
    photo = '<img src="' + escapeHtml(recipe.photo_url) + '" alt="' + escapeHtml(recipe.title) + '" loading="lazy">';
  }

  return '' +
    '<a href="recipe-details.html?id=' + recipe.id + '" class="recipe-card">' +
      '<div class="photo photo--' + photoTone(recipe.category) + '">' +
        photo +
        '<span class="recipe-card__tag">' + escapeHtml(capitalize(recipe.category)) + '</span>' +
      '</div>' +
      '<h3 class="recipe-card__title">' + escapeHtml(recipe.title) + '</h3>' +
      '<div class="meta">' +
        '<span><i class="ti ti-clock"></i>' + formatTime(recipe.time_minutes) + '</span>' +
        '<span><i class="ti ti-chart-bar"></i>' + escapeHtml(capitalize(recipe.difficulty)) + '</span>' +
      '</div>' +
    '</a>';
}