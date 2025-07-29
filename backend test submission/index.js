// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import shortUrlRoutes from './routes/shortUrls.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/shortUrls', shortUrlRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
