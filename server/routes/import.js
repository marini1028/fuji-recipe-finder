import express from 'express';
import { fetchRecipe, scrapeCategory, getFujiXWeeklyRecipeList, FUJI_X_WEEKLY_CATEGORIES } from '../services/recipeScraper.js';
import { importRecipe, importRecipes } from '../services/recipeImporter.js';

const router = express.Router();

// Get available categories for scraping
router.get('/categories', (req, res) => {
  res.json({
    categories: Object.entries(FUJI_X_WEEKLY_CATEGORIES).map(([key, url]) => ({
      id: key,
      name: key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      url
    }))
  });
});

// Preview recipes from a category (get URLs without importing)
router.get('/preview/:category', async (req, res) => {
  try {
    const categoryUrl = FUJI_X_WEEKLY_CATEGORIES[req.params.category];
    if (!categoryUrl) {
      return res.status(400).json({ error: 'Unknown category' });
    }

    const urls = await getFujiXWeeklyRecipeList(categoryUrl);
    res.json({
      category: req.params.category,
      count: urls.length,
      urls: urls.slice(0, 100) // Limit preview to 100
    });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe list', message: error.message });
  }
});

// Fetch and preview a single recipe (without importing)
router.post('/preview', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    if (!url.includes('fujixweekly.com') && !url.includes('fujifilmsimulations.com')) {
      return res.status(400).json({
        error: 'Unsupported source',
        message: 'Only fujixweekly.com and fujifilmsimulations.com are supported'
      });
    }

    const recipe = await fetchRecipe(url);
    res.json({ recipe });
  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe', message: error.message });
  }
});

// Import a single recipe by URL
router.post('/url', async (req, res) => {
  try {
    const { url, update = false } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL
    if (!url.includes('fujixweekly.com') && !url.includes('fujifilmsimulations.com')) {
      return res.status(400).json({
        error: 'Unsupported source',
        message: 'Only fujixweekly.com and fujifilmsimulations.com are supported'
      });
    }

    const scraped = await fetchRecipe(url);
    const result = await importRecipe(scraped, {
      skipExisting: !update,
      updateExisting: update
    });

    res.json(result);
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import recipe', message: error.message });
  }
});

// Import multiple recipes by URLs
router.post('/urls', async (req, res) => {
  try {
    const { urls, update = false } = req.body;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'URLs array is required' });
    }

    if (urls.length > 20) {
      return res.status(400).json({ error: 'Maximum 20 URLs per request' });
    }

    const recipes = [];
    const errors = [];

    for (const url of urls) {
      try {
        if (!url.includes('fujixweekly.com') && !url.includes('fujifilmsimulations.com')) {
          errors.push({ url, error: 'Unsupported source' });
          continue;
        }
        const recipe = await fetchRecipe(url);
        recipes.push(recipe);
        // Small delay between requests
        await new Promise(r => setTimeout(r, 1000));
      } catch (error) {
        errors.push({ url, error: error.message });
      }
    }

    const results = await importRecipes(recipes, {
      skipExisting: !update,
      updateExisting: update
    });

    res.json({
      ...results,
      fetchErrors: errors
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import recipes', message: error.message });
  }
});

// Import recipes from a category
router.post('/category/:category', async (req, res) => {
  try {
    const { limit = 20, update = false } = req.body;
    const categoryUrl = FUJI_X_WEEKLY_CATEGORIES[req.params.category];

    if (!categoryUrl) {
      return res.status(400).json({ error: 'Unknown category' });
    }

    if (limit > 50) {
      return res.status(400).json({ error: 'Maximum limit is 50 recipes per request' });
    }

    const recipes = await scrapeCategory(categoryUrl, limit);
    const results = await importRecipes(recipes, {
      skipExisting: !update,
      updateExisting: update
    });

    res.json(results);
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: 'Failed to import from category', message: error.message });
  }
});

export default router;
