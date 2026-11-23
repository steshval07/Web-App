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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
