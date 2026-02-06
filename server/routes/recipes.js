import express from 'express';
import { getDb, queryAll, queryOne } from '../db/database.js';

const router = express.Router();

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const db = await getDb();
    const recipes = queryAll(db, `
      SELECT r.*, GROUP_CONCAT(DISTINCT t.name) as tags
      FROM recipes r
      LEFT JOIN recipe_tags rt ON r.id = rt.recipe_id
      LEFT JOIN tags t ON rt.tag_id = t.id
      GROUP BY r.id
      ORDER BY r.name
    `);

    // Parse tags and sample_images into arrays
    const formattedRecipes = recipes.map(recipe => {
      let sampleImages = [];
      try {
        if (recipe.sample_images) {
          sampleImages = JSON.parse(recipe.sample_images);
        }
      } catch (e) {
        sampleImages = [];
      }
      return {
        ...recipe,
        tags: recipe.tags ? recipe.tags.split(',') : [],
        sampleImages
      };
    });

    res.json(formattedRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Failed to fetch recipes', message: error.message });
  }
});

// Get single recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const db = await getDb();
    const recipe = queryOne(db, `
      SELECT r.*, GROUP_CONCAT(DISTINCT t.name) as tags
      FROM recipes r
      LEFT JOIN recipe_tags rt ON r.id = rt.recipe_id
      LEFT JOIN tags t ON rt.tag_id = t.id
      WHERE r.id = ?
      GROUP BY r.id
    `, [req.params.id]);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Get compatible cameras
    const cameras = queryAll(db, `
      SELECT c.model
      FROM cameras c
      JOIN recipe_cameras rc ON c.id = rc.camera_id
      WHERE rc.recipe_id = ?
    `, [req.params.id]);

    let sampleImages = [];
    try {
      if (recipe.sample_images) {
        sampleImages = JSON.parse(recipe.sample_images);
      }
    } catch (e) {
      sampleImages = [];
    }

    const formattedRecipe = {
      ...recipe,
      tags: recipe.tags ? recipe.tags.split(',') : [],
      sampleImages,
      compatible_cameras: cameras.map(c => c.model)
    };

    res.json(formattedRecipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ error: 'Failed to fetch recipe', message: error.message });
  }
});

// Get all tags
router.get('/meta/tags', async (req, res) => {
  try {
    const db = await getDb();
    const tags = queryAll(db, 'SELECT * FROM tags ORDER BY category, name');

    // Group by category
    const groupedTags = tags.reduce((acc, tag) => {
      if (!acc[tag.category]) {
        acc[tag.category] = [];
      }
      acc[tag.category].push(tag);
      return acc;
    }, {});

    res.json(groupedTags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Failed to fetch tags', message: error.message });
  }
});

// Get all cameras
router.get('/meta/cameras', async (req, res) => {
  try {
    const db = await getDb();
    const cameras = queryAll(db, 'SELECT * FROM cameras ORDER BY model');
    res.json(cameras);
  } catch (error) {
    console.error('Error fetching cameras:', error);
    res.status(500).json({ error: 'Failed to fetch cameras', message: error.message });
  }
});

export default router;
