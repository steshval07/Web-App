// Backend: Express server (same approach as the SampleAPI seminar project)
import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3000;

// Let the server read JSON sent by the browser, and allow requests from other origins
app.use(express.json());
app.use(cors());

// Serve the website (the files in the "public" folder)
app.use(express.static('public'));

// Health check: shows that the server is running
app.get('/health', (req, res) => {
  res.json({ message: 'It works!!' });
});

// Allowed values for two of the fields
const validCategories = ['breakfast', 'soups', 'mains', 'salads', 'baking', 'desserts'];
const validDifficulties = ['easy', 'medium', 'hard'];

// Turn a value into trimmed text (anything that is not text becomes an empty string)
function toText(value) {
  if (typeof value === 'string') {
    return value.trim();
  }
  return '';
}

// Check the data sent by the form (used by POST and PUT).
// Returns two things:
//   errors - one message per wrong field, for example { title: 'Enter a recipe name...' }
//   recipe - the cleaned values (trimmed text, real numbers), ready to save
// If "errors" is empty, the data is valid.
function validateRecipe(body) {
  const data = body || {};
  const errors = {};

  const title = toText(data.title);
  const description = toText(data.description);
  const category = toText(data.category);
  const timeMinutes = Number(data.time_minutes);
  const servings = Number(data.servings);
  const photoUrl = toText(data.photo_url);
  const ingredients = toText(data.ingredients);
  const steps = toText(data.steps);

  // Difficulty is optional in the request: if it is missing we use "easy"
  let difficulty = toText(data.difficulty);
  if (difficulty === '') {
    difficulty = 'easy';
  }

  if (title.length < 3) {
    errors.title = 'Enter a recipe name (at least 3 characters).';
  }

  if (description.length > 200) {
    errors.description = 'Use at most 200 characters.';
  }

  if (!validCategories.includes(category)) {
    errors.category = 'Choose a category.';
  }

  // Must be a whole number greater than 0
  if (!Number.isInteger(timeMinutes) || timeMinutes <= 0) {
    errors.time_minutes = 'Enter a number greater than 0.';
  }

  if (!Number.isInteger(servings) || servings <= 0) {
    errors.servings = 'Enter a number greater than 0.';
  }

  if (!validDifficulties.includes(difficulty)) {
    errors.difficulty = 'Choose easy, medium or hard.';
  }

  // The photo is optional, but if there is a link it must start with http:// or https://
  if (photoUrl !== '' && !photoUrl.startsWith('http://') && !photoUrl.startsWith('https://')) {
    errors.photo_url = 'Enter a valid link that starts with https://';
  }

  if (ingredients === '') {
    errors.ingredients = 'Add at least one ingredient.';
  }

  if (steps === '') {
    errors.steps = 'Describe at least one step.';
  }

  const recipe = {
    title: title,
    description: description,
    category: category,
    time_minutes: timeMinutes,
    servings: servings,
    difficulty: difficulty,
    photo_url: photoUrl,
    ingredients: ingredients,
    steps: steps
  };

  return { errors, recipe };
}

// List recipes. Optional query parameters:
//   ?search=   text found in the title or in the ingredients (any letter case)
//   ?category= exact category, for example "mains"
//   ?sort=     "name" (A-Z), anything else means newest first
app.get('/api/recipes', (req, res) => {
  try {
    const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();
    const sort = req.query.sort;

    // Build the WHERE part step by step. The values go into "params"
    // and are filled in by the "?" marks, so they are never pasted into the SQL text.
    const conditions = [];
    const params = [];

    if (search !== '') {
      conditions.push('(title LIKE ? OR ingredients LIKE ?)');
      params.push('%' + search + '%', '%' + search + '%');
    }

    if (category !== '') {
      conditions.push('category = ?');
      params.push(category);
    }

    let sql = 'SELECT * FROM recipes';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    // Choose the order. Only these two fixed texts can be used.
    if (sort === 'name') {
      sql += ' ORDER BY title COLLATE NOCASE ASC';
    } else {
      sql += ' ORDER BY created_at DESC, id ASC';
    }

    const recipes = db.prepare(sql).all(...params);
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Return one recipe by its id, or 404 if it doesn't exist
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipe = db.prepare('SELECT * FROM recipes WHERE id = ?').get(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
