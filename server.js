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
