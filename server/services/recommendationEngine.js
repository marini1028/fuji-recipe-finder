import { getDb, queryAll } from '../db/database.js';

// Map user-friendly input values to database tags
const inputToTagsMap = {
  lighting: {
    'bright_sunlight': ['daylight', 'harsh_light'],
    'golden_hour': ['golden_hour', 'soft_light'],
    'blue_hour': ['blue_hour', 'low_light'],
    'overcast': ['overcast', 'soft_light'],
    'indoor': ['indoor', 'low_light'],
    'night': ['night', 'low_light'],
    'mixed': ['indoor', 'daylight']
  },
  subject: {
    'portrait': ['portrait'],
    'street': ['street', 'urban', 'documentary'],
    'landscape': ['landscape', 'nature'],
    'architecture': ['architecture', 'urban'],
    'nature': ['nature', 'landscape'],
    'food': ['food', 'indoor'],
    'travel': ['travel', 'documentary', 'street'],
    'event': ['documentary', 'portrait', 'indoor']
  },
  mood: {
    'cinematic': ['cinematic', 'dramatic', 'moody'],
    'vintage': ['vintage', 'filmic', 'warm'],
    'modern': ['modern', 'contrasty'],
    'dreamy': ['dreamy', 'soft', 'pastel'],
    'moody': ['moody', 'dramatic', 'contrasty'],
    'natural': ['natural', 'soft'],
    'dramatic': ['dramatic', 'contrasty', 'moody'],
    'minimal': ['modern', 'soft', 'muted']
  },
  colorPreference: {
    'warm': ['warm', 'earthy'],
    'cool': ['cool'],
    'neutral': ['neutral', 'natural'],
    'vibrant': ['vibrant'],
    'muted': ['muted', 'pastel'],
    'bw': ['monochrome'],
    'teal_orange': ['teal_orange', 'cinematic']
  },
  location: {
    'city': ['city', 'urban', 'street'],
    'nature': ['nature', 'mountain'],
    'beach': ['beach', 'summer'],
    'cafe': ['cafe', 'indoor'],
    'studio': ['studio', 'indoor'],
    'home': ['indoor']
  },
  season: {
    'summer': ['summer', 'vibrant'],
    'autumn': ['autumn', 'warm', 'earthy'],
    'winter': ['winter', 'cool'],
    'spring': ['spring', 'pastel']
  }
};

// Weight configuration for scoring
const categoryWeights = {
  lighting: 0.20,
  subject: 0.20,
  mood: 0.175,
  colorPreference: 0.175,
  location: 0.125,
  season: 0.125
};

export async function getRecommendations(input) {
  const db = await getDb();

  // Get all recipes with their tags
  const recipes = queryAll(db, `
    SELECT r.*, GROUP_CONCAT(t.name) as tags
    FROM recipes r
    LEFT JOIN recipe_tags rt ON r.id = rt.recipe_id
    LEFT JOIN tags t ON rt.tag_id = t.id
    GROUP BY r.id
  `);

  // Convert input to weighted tag list
  const targetTags = new Map();

  for (const [category, value] of Object.entries(input)) {
    if (!value || !inputToTagsMap[category] || !inputToTagsMap[category][value]) {
      continue;
    }

    const tags = inputToTagsMap[category][value];
    const weight = categoryWeights[category] || 0.1;

    for (const tag of tags) {
      const currentWeight = targetTags.get(tag) || 0;
      targetTags.set(tag, currentWeight + weight);
    }
  }

  // Score each recipe
  const scoredRecipes = recipes.map(recipe => {
    const recipeTags = recipe.tags ? recipe.tags.split(',') : [];
    let score = 0;
    const matchedTags = [];

    for (const [tag, weight] of targetTags) {
      if (recipeTags.includes(tag)) {
        score += weight;
        matchedTags.push(tag);
      }
    }

    // Normalize score
    const maxPossibleScore = Array.from(targetTags.values()).reduce((a, b) => a + b, 0);
    const normalizedScore = maxPossibleScore > 0 ? (score / maxPossibleScore) * 100 : 0;

    return {
      ...recipe,
      tags: recipeTags,
      score: normalizedScore,
      matchedTags
    };
  });

  // Sort by score and take top 3
  const topRecipes = scoredRecipes
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Generate explanations
  const recommendations = topRecipes.map(recipe => ({
    recipe: formatRecipeOutput(recipe),
    score: Math.round(recipe.score),
    explanation: generateExplanation(recipe, input)
  }));

  return recommendations;
}

function formatRecipeOutput(recipe) {
  // Parse sample_images JSON string
  let sampleImages = [];
  try {
    if (recipe.sample_images) {
      sampleImages = JSON.parse(recipe.sample_images);
    }
  } catch (e) {
    sampleImages = [];
  }

  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    filmSimulation: recipe.film_simulation,
    sampleImages,
    settings: {
      whiteBalance: recipe.white_balance,
      whiteBalanceShift: {
        red: recipe.white_balance_shift_red,
        blue: recipe.white_balance_shift_blue
      },
      dynamicRange: recipe.dynamic_range,
      highlight: recipe.highlight,
      shadow: recipe.shadow,
      color: recipe.color,
      sharpness: recipe.sharpness,
      noiseReduction: recipe.noise_reduction,
      grainEffect: recipe.grain_effect,
      grainSize: recipe.grain_size,
      colorChromeEffect: recipe.color_chrome_effect,
      colorChromeFxBlue: recipe.color_chrome_fx_blue,
      clarity: recipe.clarity,
      exposureCompensation: recipe.exposure_compensation
    },
    tags: recipe.tags
  };
}

function generateExplanation(recipe, input) {
  const reasons = [];

  // Explain based on matched categories
  if (input.lighting && recipe.matchedTags.some(t =>
    ['daylight', 'golden_hour', 'blue_hour', 'overcast', 'indoor', 'low_light', 'night', 'harsh_light', 'soft_light'].includes(t))) {
    reasons.push(`Works well in ${input.lighting.replace('_', ' ')} conditions`);
  }

  if (input.subject && recipe.matchedTags.some(t =>
    ['portrait', 'street', 'landscape', 'architecture', 'nature', 'food', 'travel', 'documentary'].includes(t))) {
    reasons.push(`Excellent for ${input.subject} photography`);
  }

  if (input.mood && recipe.matchedTags.some(t =>
    ['cinematic', 'vintage', 'modern', 'moody', 'dreamy', 'contrasty', 'soft', 'dramatic', 'natural', 'filmic'].includes(t))) {
    reasons.push(`Creates a ${input.mood} aesthetic`);
  }

  if (input.colorPreference) {
    if (input.colorPreference === 'bw') {
      reasons.push('Perfect for black and white photography');
    } else if (input.colorPreference === 'teal_orange') {
      reasons.push('Delivers cinematic teal and orange color grading');
    } else {
      reasons.push(`Produces ${input.colorPreference} tones`);
    }
  }

  // Add film simulation context
  const simExplanations = {
    'Classic Chrome': 'Classic Chrome provides a timeless, muted film look',
    'Velvia': 'Velvia delivers vibrant, saturated colors',
    'Astia': 'Astia offers soft, pleasing skin tones',
    'Pro Neg Hi': 'Pro Neg Hi gives smooth gradations with controlled contrast',
    'Pro Neg Std': 'Pro Neg Std provides natural skin reproduction',
    'Eterna': 'Eterna creates a cinematic, understated look',
    'Classic Neg': 'Classic Neg adds punchy contrast with unique color rendering',
    'Acros': 'Acros delivers smooth, fine-grained black and white',
    'Acros+R': 'Acros with red filter enhances contrast and drama',
    'Provia': 'Provia provides accurate, balanced colors',
    'Nostalgic Neg': 'Nostalgic Neg creates warm, amber-tinted memories'
  };

  if (simExplanations[recipe.film_simulation]) {
    reasons.push(simExplanations[recipe.film_simulation]);
  }

  return reasons.length > 0 ? reasons.join('. ') + '.' : 'A versatile recipe that works well for your shooting scenario.';
}

export function parseUserInput(input) {
  // Validate and sanitize user input
  const validFields = ['lighting', 'subject', 'mood', 'colorPreference', 'location', 'season'];
  const parsed = {};

  for (const field of validFields) {
    if (input[field] && inputToTagsMap[field] && inputToTagsMap[field][input[field]]) {
      parsed[field] = input[field];
    }
  }

  return parsed;
}
