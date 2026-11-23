// Database: SQLite via better-sqlite3
import Database from 'better-sqlite3';

// Open (or create) the database file in the project root
const db = new Database('recipes.db');

// Create the recipes table if it does not exist yet
db.exec(`
  CREATE TABLE IF NOT EXISTS recipes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT NOT NULL,
    description  TEXT,
    category     TEXT NOT NULL,
    time_minutes INTEGER NOT NULL,
    servings     INTEGER NOT NULL,
    difficulty   TEXT NOT NULL DEFAULT 'easy',
    photo_url    TEXT,
    ingredients  TEXT NOT NULL,
    steps        TEXT NOT NULL,
    created_at   TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Categories: breakfast, soups, mains, salads, baking, desserts

// ---------- Demo recipes ----------
// Added to the database only when the table is empty.
// The ORDER matters: the pancakes must be first, so they get id 1
// (the "Editor's pick" on the home page links to id 1).

// Every photo link gets these options (smaller, faster image)
const photoOptions = '?auto=compress&cs=tinysrgb&w=1200';

// Ingredients and steps are written as lists here and joined with a new line,
// because the database stores them as text with one item per line.
const demoRecipes = [
  {
    title: 'Fluffy pancakes with berries and honey',
    description: 'A tall stack of soft pancakes with blackberries, blueberries and a drizzle of honey — the Sunday breakfast everyone asks for twice.',
    category: 'breakfast',
    time_minutes: 20,
    servings: 4,
    difficulty: 'easy',
    photo_url: 'https://images.pexels.com/photos/3780469/pexels-photo-3780469.jpeg',
    ingredients: [
      'Plain flour - 200 g',
      'Milk - 300 ml',
      'Eggs - 2 pcs',
      'Sugar - 2 tbsp',
      'Baking powder - 2 tsp',
      'Butter - 30 g',
      'Blueberries and blackberries - 200 g',
      'Honey - 3 tbsp'
    ],
    steps: [
      'Whisk the flour, sugar and baking powder in a large bowl.',
      'Beat the eggs with the milk and melted butter, then stir into the flour until just combined.',
      'Fry a small ladle of batter per pancake in a buttered pan for 2 minutes on each side until golden.',
      'Stack the pancakes on plates, top with the berries and drizzle with honey.'
    ]
  },
  {
    title: 'Creamy tomato soup',
    description: 'Sweet roasted tomatoes, garlic and a splash of cream — a velvety bowl of comfort that tastes even better the next day.',
    category: 'soups',
    time_minutes: 35,
    servings: 4,
    difficulty: 'easy',
    photo_url: 'https://images.pexels.com/photos/17302314/pexels-photo-17302314.jpeg',
    ingredients: [
      'Ripe tomatoes - 1 kg',
      'Yellow onion - 1 pc',
      'Garlic cloves - 4 pcs',
      'Olive oil - 3 tbsp',
      'Vegetable stock - 500 ml',
      'Cream - 100 ml',
      'Fresh basil - 1 bunch',
      'Salt and pepper - to taste'
    ],
    steps: [
      'Heat the oven to 200 °C. Halve the tomatoes, quarter the onion and place them on a tray with the garlic. Drizzle with olive oil, season and roast for 25 minutes.',
      'Tip everything into a pot, pour in the stock and bring to a gentle simmer for 5 minutes.',
      'Add most of the basil and blend with a stick blender until silky. Stir in the cream and adjust the seasoning.',
      'Ladle into bowls, top with the remaining basil and a swirl of olive oil. Great with toasted bread.'
    ]
  },
  {
    title: 'Rosemary and onion focaccia',
    description: 'Soft, airy bread with a crisp golden top, fresh rosemary and sweet caramelised onions.',
    category: 'baking',
    time_minutes: 120,
    servings: 8,
    difficulty: 'medium',
    photo_url: 'https://images.pexels.com/photos/12335533/pexels-photo-12335533.jpeg',
    ingredients: [
      'Bread flour - 500 g',
      'Warm water - 400 ml',
      'Dry yeast - 7 g',
      'Salt - 2 tsp',
      'Olive oil - 5 tbsp',
      'Red onion - 2 pcs',
      'Fresh rosemary - 3 sprigs',
      'Coarse sea salt - 1 tsp'
    ],
    steps: [
      'Mix the flour, yeast, salt, warm water and 2 tbsp of olive oil into a sticky dough. Cover and let it rise for 1 hour.',
      'Slice the onions and cook them slowly in a little oil for 15 minutes until soft and golden.',
      'Pour 2 tbsp of oil into a baking tray, stretch the dough into it and press in dimples with your fingers.',
      'Top with the onions, rosemary and sea salt, and let it rest for 20 minutes.',
      'Bake at 220 °C for 25 minutes until golden. Cool a little before slicing.'
    ]
  },
  {
    title: 'Greek salad with feta',
    description: 'Crunchy cucumber, juicy tomatoes, olives and a thick slice of feta with olive oil and oregano.',
    category: 'salads',
    time_minutes: 15,
    servings: 2,
    difficulty: 'easy',
    photo_url: 'https://images.pexels.com/photos/434258/pexels-photo-434258.jpeg',
    ingredients: [
      'Tomatoes - 4 pcs',
      'Cucumber - 1 pc',
      'Red onion - 1 pc',
      'Kalamata olives - 80 g',
      'Feta cheese - 150 g',
      'Olive oil - 3 tbsp',
      'Dried oregano - 1 tsp'
    ],
    steps: [
      'Cut the tomatoes and cucumber into large chunks and slice the onion into thin rings.',
      'Put the vegetables and olives in a bowl.',
      'Place the feta on top, drizzle with olive oil and sprinkle with oregano.',
      'Serve right away, with bread to soak up the juices.'
    ]
  },
  {
    title: 'Berry panna cotta',
    description: 'A silky vanilla cream dessert topped with fresh berries and a mint leaf.',
    category: 'desserts',
    time_minutes: 240,
    servings: 6,
    difficulty: 'medium',
    photo_url: 'https://images.pexels.com/photos/3301907/pexels-photo-3301907.jpeg',
    ingredients: [
      'Double cream - 400 ml',
      'Milk - 200 ml',
      'Sugar - 60 g',
      'Gelatine sheets - 3 pcs',
      'Vanilla pod - 1 pc',
      'Mixed berries - 250 g',
      'Fresh mint - 6 leaves'
    ],
    steps: [
      'Soak the gelatine sheets in cold water for 5 minutes.',
      'Warm the cream, milk, sugar and vanilla seeds in a pot. Do not let it boil.',
      'Take the pot off the heat, squeeze out the gelatine and stir it in until dissolved.',
      'Pour into 6 glasses and chill in the fridge for at least 4 hours.',
      'Top with the berries and a mint leaf before serving.'
    ]
  },
  {
    title: 'Shakshuka',
    description: 'Eggs poached in a spiced tomato and pepper sauce — a warming breakfast made in one pan.',
    category: 'breakfast',
    time_minutes: 30,
    servings: 2,
    difficulty: 'easy',
    photo_url: 'https://images.pexels.com/photos/3648979/pexels-photo-3648979.jpeg',
    ingredients: [
      'Eggs - 4 pcs',
      'Canned chopped tomatoes - 400 g',
      'Red pepper - 1 pc',
      'Onion - 1 pc',
      'Garlic cloves - 2 pcs',
      'Ground cumin - 1 tsp',
      'Paprika - 1 tsp',
      'Olive oil - 2 tbsp',
      'Fresh parsley - 1 handful'
    ],
    steps: [
      'Fry the chopped onion and pepper in olive oil for 5 minutes. Add the garlic, cumin and paprika.',
      'Pour in the tomatoes and simmer for 10 minutes until the sauce thickens.',
      'Make four small wells in the sauce and crack an egg into each one.',
      'Cover the pan and cook for 5 minutes until the whites are set. Sprinkle with parsley and serve with bread.'
    ]
  },
  {
    title: 'Grilled salmon with vegetables',
    description: 'Juicy salmon fillets with grilled courgette and peppers, finished with lemon and herbs.',
    category: 'mains',
    time_minutes: 25,
    servings: 2,
    difficulty: 'easy',
    photo_url: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg',
    ingredients: [
      'Salmon fillets - 2 pcs',
      'Courgette - 1 pc',
      'Red pepper - 1 pc',
      'Garlic cloves - 2 pcs',
      'Olive oil - 2 tbsp',
      'Lemon - 1 pc',
      'Fresh dill - 1 handful',
      'Salt and pepper - to taste'
    ],
    steps: [
      'Slice the courgette and pepper, and toss them with half of the olive oil, salt and pepper.',
      'Grill the vegetables for 8 minutes, turning once, until soft with charred edges.',
      'Rub the salmon with the remaining oil and the crushed garlic, then grill for 4 minutes on each side.',
      'Serve the salmon on the vegetables with lemon juice and chopped dill.'
    ]
  },
  {
    title: 'Margherita pizza',
    description: 'Thin, chewy homemade crust with tomato sauce, melting mozzarella and fresh basil.',
    category: 'mains',
    time_minutes: 90,
    servings: 4,
    difficulty: 'medium',
    photo_url: 'https://images.pexels.com/photos/32872596/pexels-photo-32872596.jpeg',
    ingredients: [
      'Pizza flour - 500 g',
      'Warm water - 300 ml',
      'Dry yeast - 7 g',
      'Salt - 2 tsp',
      'Crushed tomatoes - 300 g',
      'Mozzarella - 250 g',
      'Fresh basil - 1 bunch',
      'Olive oil - 2 tbsp'
    ],
    steps: [
      'Mix the flour, yeast, salt, water and olive oil. Knead for 10 minutes and let the dough rise for 1 hour.',
      'Heat the oven to its highest setting, with a baking tray inside.',
      'Divide the dough into 2 parts and stretch each into a thin round. Spread with the tomatoes.',
      'Tear the mozzarella over the top and bake for 8 to 10 minutes until the crust is golden.',
      'Scatter with basil leaves and serve hot.'
    ]
  },
  {
    title: 'Parmesan risotto',
    description: 'Slow-cooked creamy rice with white wine and plenty of Parmesan — it needs patience, but it is worth it.',
    category: 'mains',
    time_minutes: 40,
    servings: 4,
    difficulty: 'hard',
    photo_url: 'https://images.pexels.com/photos/6406460/pexels-photo-6406460.jpeg',
    ingredients: [
      'Arborio rice - 300 g',
      'Chicken or vegetable stock - 1 l',
      'White wine - 150 ml',
      'Onion - 1 pc',
      'Butter - 40 g',
      'Parmesan - 80 g',
      'Olive oil - 1 tbsp',
      'Salt and pepper - to taste'
    ],
    steps: [
      'Keep the stock warm in a small pot. Fry the finely chopped onion in oil and half of the butter until soft.',
      'Add the rice and stir for 2 minutes. Pour in the wine and stir until it is absorbed.',
      'Add the stock one ladle at a time, stirring often and waiting until each ladle is absorbed. This takes about 20 minutes.',
      'When the rice is creamy and tender, take it off the heat and stir in the rest of the butter and the grated Parmesan.',
      'Rest for 2 minutes, season and serve immediately.'
    ]
  }
];

// Count the recipes. If there are none, insert the demo recipes.
const count = db.prepare('SELECT COUNT(*) AS total FROM recipes').get();

if (count.total === 0) {
  const insertRecipe = db.prepare(`
    INSERT INTO recipes
      (title, description, category, time_minutes, servings, difficulty, photo_url, ingredients, steps)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const recipe of demoRecipes) {
    insertRecipe.run(
      recipe.title,
      recipe.description,
      recipe.category,
      recipe.time_minutes,
      recipe.servings,
      recipe.difficulty,
      recipe.photo_url + photoOptions,
      recipe.ingredients.join('\n'),
      recipe.steps.join('\n')
    );
  }
}

export default db;
