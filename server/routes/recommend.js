import express from 'express';
import { getRecommendations } from '../services/recommendationEngine.js';
import { parseNaturalLanguage } from '../services/nlpService.js';

const router = express.Router();

// Structured form recommendation
router.post('/structured', async (req, res) => {
  try {
    const { lighting, subject, mood, colorPreference, location, season } = req.body;

    const input = {
      lighting,
      subject,
      mood,
      colorPreference,
      location,
      season
    };

    const recommendations = await getRecommendations(input);
    res.json(recommendations);
  } catch (error) {
    console.error('Structured recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations', message: error.message });
  }
});

// Natural language recommendation
router.post('/natural', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Parse natural language to structured input
    const parsedInput = await parseNaturalLanguage(prompt);

    // Get recommendations using parsed input
    const recommendations = await getRecommendations(parsedInput);

    res.json({
      parsed: parsedInput,
      recommendations
    });
  } catch (error) {
    console.error('Natural language recommendation error:', error);
    res.status(500).json({ error: 'Failed to process natural language', message: error.message });
  }
});

export default router;
