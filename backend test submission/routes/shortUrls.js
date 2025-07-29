import express from 'express';
const router = express.Router();
import {
  createShortUrl,
  redirectToLongUrl,
  getShortUrlStats
} from '../controllers/shortUrlController.js';

router.post('/shortUrls', createShortUrl);
router.get('/shortUrls/:shortcode', getShortUrlStats);
router.get('/:shortcode', redirectToLongUrl);

export default router;
