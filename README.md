Mise. - Recipe book

Mise is a web app for saving, browsing and searching recipes. It was made as a team project for the Web Application Programming course at the Romanian-American University. The name comes from the French kitchen phrase "mise en place", which means "everything in its place".

What the app does

You can add, edit and delete your own recipes. Each recipe has a name, category, cooking time, servings, difficulty, photo, ingredients and steps. You can search recipes by name or by ingredient, filter them by category, and open any recipe to see its full details.

Project structure

public/ - everything the browser sees: the pages, style.css and the js folder
public/js/ - frontend scripts: api.js (shared), home.js, recipe.js, form.js
server.js - backend: Express server and API
db.js - database: SQLite table and demo recipes
package.json - project settings and dependencies

Pages (in the public folder)

index.html is the home page with search, category filter and the list of all recipes.
recipe-details.html shows one recipe with its ingredients, steps and edit and delete buttons.
add-recipe.html is the form for adding or editing a recipe.
categories.html shows all recipe categories.
about.html describes the project and the team.
style.css contains all the styles for the site.

How to run

You need Node.js 22 or newer (https://nodejs.org).

1. Open a terminal in the project folder.
2. Run npm install (only the first time).
3. Run npm start.
4. Open http://localhost:3000 in your browser.

The first start creates the database file recipes.db with 9 demo recipes. Your recipes stay saved after you close the page or restart the server. To go back to the demo recipes, stop the server, delete recipes.db and start it again.

Fonts, icons and photos load from the internet, so you need a connection.

Technologies

HTML, CSS and JavaScript on the front end. Node.js with Express on the back end, and a SQLite database (better-sqlite3).

Team

Team member 1 - design, HTML and CSS
Team member 2 - ...
