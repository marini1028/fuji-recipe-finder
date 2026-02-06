import { getDb, queryAll, queryOne, run } from '../db/database.js';

// Map common film simulation names to standardized values
const FILM_SIMULATION_MAP = {
  'classic chrome': 'Classic Chrome',
  'velvia': 'Velvia',
  'velvia/vivid': 'Velvia',
  'astia': 'Astia',
  'astia/soft': 'Astia',
  'provia': 'Provia',
  'provia/standard': 'Provia',
  'pro neg hi': 'Pro Neg Hi',
  'pro neg. hi': 'Pro Neg Hi',
  'pro negative hi': 'Pro Neg Hi',
  'pro neg std': 'Pro Neg Std',
  'pro neg. std': 'Pro Neg Std',
  'pro negative std': 'Pro Neg Std',
  'pro negative standard': 'Pro Neg Std',
  'eterna': 'Eterna',
  'eterna/cinema': 'Eterna',
  'eterna bleach bypass': 'Eterna Bleach Bypass',
  'classic neg': 'Classic Neg',
  'classic neg.': 'Classic Neg',
  'classic negative': 'Classic Neg',
  'nostalgic neg': 'Nostalgic Neg',
  'nostalgic neg.': 'Nostalgic Neg',
  'nostalgic negative': 'Nostalgic Neg',
  'acros': 'Acros',
  'acros+r': 'Acros+R',
  'acros + r': 'Acros+R',
  'acros+g': 'Acros+G',
  'acros + g': 'Acros+G',
  'acros+ye': 'Acros+Ye',
  'acros + ye': 'Acros+Ye',
  'monochrome': 'Monochrome',
  'monochrome+r': 'Monochrome+R',
  'monochrome+g': 'Monochrome+G',
  'monochrome+ye': 'Monochrome+Ye',
  'sepia': 'Sepia',
  'reala ace': 'Reala Ace'
};

function normalizeFilmSimulation(filmSim) {
  if (!filmSim) return 'Classic Chrome';

  const lower = filmSim.toLowerCase().trim();

  // Direct match
  if (FILM_SIMULATION_MAP[lower]) {
    return FILM_SIMULATION_MAP[lower];
  }

  // Try to find a known film simulation within the text
  const knownSims = Object.keys(FILM_SIMULATION_MAP);
  for (const sim of knownSims) {
    if (lower.includes(sim)) {
      return FILM_SIMULATION_MAP[sim];
    }
  }

  // Try common patterns
  if (lower.includes('nostalgic') || lower.includes('nostalgia')) return 'Nostalgic Neg';
  if (lower.includes('classic neg')) return 'Classic Neg';
  if (lower.includes('classic chrome')) return 'Classic Chrome';
  if (lower.includes('velvia')) return 'Velvia';
  if (lower.includes('astia')) return 'Astia';
  if (lower.includes('provia')) return 'Provia';
  if (lower.includes('eterna') && lower.includes('bleach')) return 'Eterna Bleach Bypass';
  if (lower.includes('eterna')) return 'Eterna';
  if (lower.includes('acros')) return 'Acros';
  if (lower.includes('reala')) return 'Reala Ace';
  if (lower.includes('pro neg')) return 'Pro Neg Hi';

  // Default
  return 'Classic Chrome';
}

function normalizeWhiteBalance(wb) {
  if (!wb) return 'Auto';

  // Handle Kelvin values
  const kelvMatch = wb.match(/(\d{4})K?/i);
  if (kelvMatch) {
    return `${kelvMatch[1]}K`;
  }

  // Standardize preset names
  const lower = wb.toLowerCase();
  if (lower.includes('auto')) return 'Auto';
  if (lower.includes('daylight') || lower.includes('sunny')) return 'Daylight';
  if (lower.includes('shade')) return 'Shade';
  if (lower.includes('cloudy')) return 'Cloudy';
  if (lower.includes('incandescent') || lower.includes('tungsten')) return 'Incandescent';
  if (lower.includes('fluorescent 1') || lower.includes('fluorescent1')) return 'Fluorescent 1';
  if (lower.includes('fluorescent 2') || lower.includes('fluorescent2')) return 'Fluorescent 2';
  if (lower.includes('fluorescent 3') || lower.includes('fluorescent3')) return 'Fluorescent 3';
  if (lower.includes('fluorescent')) return 'Fluorescent 1';
  if (lower.includes('underwater')) return 'Underwater';

  return wb;
}

function normalizeDynamicRange(dr) {
  if (!dr) return 'DR100';
  const match = dr.match(/(\d+)/);
  if (match) {
    const num = parseInt(match[1]);
    if (num === 100 || num === 200 || num === 400) {
      return `DR${num}`;
    }
  }
  return 'DR100';
}

function normalizeExposureComp(exp) {
  if (!exp) return '0';
  const cleaned = exp.toString().trim();
  if (cleaned === '0' || cleaned === '+0' || cleaned === '-0') return '0';
  return cleaned;
}

// Auto-generate description based on recipe settings
function generateDescription(recipe) {
  const filmSim = recipe.film_simulation || 'Classic Chrome';
  const parts = [];

  // Film simulation character
  const filmDescriptions = {
    'Classic Chrome': 'muted, documentary-style colors with a timeless aesthetic',
    'Classic Neg': 'punchy contrast with unique, nostalgic color rendering',
    'Velvia': 'vivid, saturated colors perfect for landscapes',
    'Astia': 'soft, pleasing tones ideal for portraits',
    'Provia': 'balanced, natural colors for versatile shooting',
    'Pro Neg Hi': 'smooth gradations with soft contrast for portraits',
    'Pro Neg Std': 'natural skin tones with gentle contrast',
    'Eterna': 'cinematic, understated look with muted colors',
    'Eterna Bleach Bypass': 'desaturated, high-contrast cinematic look',
    'Nostalgic Neg': 'warm, amber-tinted vintage feel reminiscent of 1970s photography',
    'Acros': 'smooth, fine-grained black and white with beautiful tonal range',
    'Acros+R': 'high-contrast black and white with enhanced reds for dramatic skies',
    'Acros+G': 'black and white with enhanced greens for nature photography',
    'Acros+Ye': 'black and white with warm contrast and smooth skin tones',
    'Reala Ace': 'natural colors with excellent skin tones and fine detail'
  };

  // Start with film simulation description
  if (filmDescriptions[filmSim]) {
    parts.push(`${filmSim} film simulation with ${filmDescriptions[filmSim]}`);
  } else {
    parts.push(`${filmSim} film simulation for a unique photographic look`);
  }

  // Build characteristics list
  const characteristics = [];

  // Color temperature
  const red = recipe.white_balance_shift_red || 0;
  const blue = recipe.white_balance_shift_blue || 0;
  if (red > 2 || blue < -2) {
    characteristics.push('warm color tones');
  } else if (blue > 2 || red < -2) {
    characteristics.push('cool color tones');
  }

  // Contrast
  const highlight = recipe.highlight || 0;
  const shadow = recipe.shadow || 0;
  if (highlight > 0 && shadow < 0) {
    characteristics.push('punchy contrast');
  } else if (highlight < 0 && shadow > 0) {
    characteristics.push('soft, lifted shadows');
  } else if (shadow > 1) {
    characteristics.push('open shadows for low-light situations');
  }

  // Grain
  if (recipe.grain_effect === 'Strong') {
    characteristics.push('prominent film grain for an authentic analog feel');
  } else if (recipe.grain_effect === 'Weak') {
    characteristics.push('subtle grain texture');
  }

  // Color Chrome
  if (recipe.color_chrome_effect === 'Strong') {
    characteristics.push('rich, saturated colors');
  }

  // Dynamic range
  if (recipe.dynamic_range === 'DR400') {
    characteristics.push('extended dynamic range');
  } else if (recipe.dynamic_range === 'DR200') {
    characteristics.push('balanced dynamic range');
  }

  // Sharpness
  const sharpness = recipe.sharpness || 0;
  if (sharpness <= -2) {
    characteristics.push('soft rendering');
  } else if (sharpness >= 2) {
    characteristics.push('crisp detail');
  }

  // Build final description
  let desc = parts[0] + '.';
  if (characteristics.length > 0) {
    desc += ' Features ' + characteristics.join(', ') + '.';
  }

  return desc;
}

// Convert scraped recipe to database format
export function normalizeRecipe(scrapedRecipe) {
  const normalized = {
    name: scrapedRecipe.name || 'Untitled Recipe',
    description: '', // Will be set below
    film_simulation: normalizeFilmSimulation(scrapedRecipe.filmSimulation),
    white_balance: normalizeWhiteBalance(scrapedRecipe.whiteBalance),
    white_balance_shift_red: parseInt(scrapedRecipe.whiteBalanceShiftRed) || 0,
    white_balance_shift_blue: parseInt(scrapedRecipe.whiteBalanceShiftBlue) || 0,
    dynamic_range: normalizeDynamicRange(scrapedRecipe.dynamicRange),
    highlight: parseInt(scrapedRecipe.highlight) || 0,
    shadow: parseInt(scrapedRecipe.shadow) || 0,
    color: parseInt(scrapedRecipe.color) || 0,
    sharpness: parseInt(scrapedRecipe.sharpness) || 0,
    noise_reduction: parseInt(scrapedRecipe.noiseReduction) || 0,
    grain_effect: scrapedRecipe.grainEffect || 'Off',
    grain_size: scrapedRecipe.grainSize || 'Small',
    color_chrome_effect: scrapedRecipe.colorChromeEffect || 'Off',
    color_chrome_fx_blue: scrapedRecipe.colorChromeFxBlue || 'Off',
    clarity: parseInt(scrapedRecipe.clarity) || 0,
    exposure_compensation: normalizeExposureComp(scrapedRecipe.exposureCompensation),
    sample_images: JSON.stringify(scrapedRecipe.sampleImages || []),
    source: scrapedRecipe.source || 'manual',
    source_url: scrapedRecipe.sourceUrl || null,
    author: scrapedRecipe.author || null
  };

  // Auto-generate description
  normalized.description = generateDescription(normalized);

  return normalized;
}

// Check if recipe already exists (by name or source URL)
export async function recipeExists(recipe) {
  const db = await getDb();

  // Check by source URL first
  if (recipe.source_url) {
    const byUrl = queryOne(db, 'SELECT id FROM recipes WHERE source_url = ?', [recipe.source_url]);
    if (byUrl) return byUrl.id;
  }

  // Check by name
  const byName = queryOne(db, 'SELECT id FROM recipes WHERE name = ?', [recipe.name]);
  if (byName) return byName.id;

  return null;
}

// Import a single recipe
export async function importRecipe(scrapedRecipe, options = {}) {
  const { skipExisting = true, updateExisting = false } = options;
  const normalized = normalizeRecipe(scrapedRecipe);

  const existingId = await recipeExists(normalized);

  if (existingId) {
    if (skipExisting && !updateExisting) {
      console.log(`Skipping existing recipe: ${normalized.name}`);
      return { status: 'skipped', id: existingId, name: normalized.name };
    }

    if (updateExisting) {
      const db = await getDb();
      run(db, `
        UPDATE recipes SET
          description = ?,
          film_simulation = ?,
          white_balance = ?,
          white_balance_shift_red = ?,
          white_balance_shift_blue = ?,
          dynamic_range = ?,
          highlight = ?,
          shadow = ?,
          color = ?,
          sharpness = ?,
          noise_reduction = ?,
          grain_effect = ?,
          grain_size = ?,
          color_chrome_effect = ?,
          color_chrome_fx_blue = ?,
          clarity = ?,
          exposure_compensation = ?,
          sample_images = ?,
          source = ?,
          source_url = ?,
          author = ?
        WHERE id = ?
      `, [
        normalized.description,
        normalized.film_simulation,
        normalized.white_balance,
        normalized.white_balance_shift_red,
        normalized.white_balance_shift_blue,
        normalized.dynamic_range,
        normalized.highlight,
        normalized.shadow,
        normalized.color,
        normalized.sharpness,
        normalized.noise_reduction,
        normalized.grain_effect,
        normalized.grain_size,
        normalized.color_chrome_effect,
        normalized.color_chrome_fx_blue,
        normalized.clarity,
        normalized.exposure_compensation,
        normalized.sample_images,
        normalized.source,
        normalized.source_url,
        normalized.author,
        existingId
      ]);
      console.log(`Updated recipe: ${normalized.name}`);
      return { status: 'updated', id: existingId, name: normalized.name };
    }
  }

  // Insert new recipe
  const db = await getDb();
  const result = run(db, `
    INSERT INTO recipes (
      name, description, film_simulation, white_balance,
      white_balance_shift_red, white_balance_shift_blue,
      dynamic_range, highlight, shadow, color, sharpness, noise_reduction,
      grain_effect, grain_size, color_chrome_effect, color_chrome_fx_blue,
      clarity, exposure_compensation, sample_images, source, source_url, author
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    normalized.name,
    normalized.description,
    normalized.film_simulation,
    normalized.white_balance,
    normalized.white_balance_shift_red,
    normalized.white_balance_shift_blue,
    normalized.dynamic_range,
    normalized.highlight,
    normalized.shadow,
    normalized.color,
    normalized.sharpness,
    normalized.noise_reduction,
    normalized.grain_effect,
    normalized.grain_size,
    normalized.color_chrome_effect,
    normalized.color_chrome_fx_blue,
    normalized.clarity,
    normalized.exposure_compensation,
    normalized.sample_images,
    normalized.source,
    normalized.source_url,
    normalized.author
  ]);

  // Auto-assign tags based on recipe characteristics
  await autoAssignTags(result.lastInsertRowid, normalized);

  // Associate with all cameras
  await associateWithCameras(result.lastInsertRowid);

  console.log(`Imported recipe: ${normalized.name} (ID: ${result.lastInsertRowid})`);
  return { status: 'imported', id: result.lastInsertRowid, name: normalized.name };
}

// Auto-assign tags based on recipe characteristics
async function autoAssignTags(recipeId, recipe) {
  const db = await getDb();
  const tags = [];

  // Based on film simulation
  const filmSimTags = {
    'Classic Chrome': ['street', 'documentary', 'muted', 'natural', 'travel'],
    'Classic Neg': ['street', 'contrasty', 'urban', 'city'],
    'Velvia': ['landscape', 'vibrant', 'nature', 'travel'],
    'Astia': ['portrait', 'soft', 'pastel', 'dreamy'],
    'Pro Neg Hi': ['portrait', 'soft', 'filmic', 'indoor'],
    'Pro Neg Std': ['portrait', 'natural', 'soft', 'golden_hour'],
    'Eterna': ['cinematic', 'moody', 'muted', 'night'],
    'Eterna Bleach Bypass': ['cinematic', 'dramatic', 'contrasty', 'moody'],
    'Nostalgic Neg': ['vintage', 'warm', 'filmic', 'portrait'],
    'Acros': ['monochrome', 'street', 'portrait'],
    'Acros+R': ['monochrome', 'contrasty', 'dramatic', 'street'],
    'Provia': ['natural', 'neutral', 'travel', 'landscape', 'daylight'],
    'Reala Ace': ['natural', 'portrait', 'soft', 'daylight']
  };

  if (filmSimTags[recipe.film_simulation]) {
    tags.push(...filmSimTags[recipe.film_simulation]);
  }

  // Based on color temperature
  const redShift = recipe.white_balance_shift_red || 0;
  const blueShift = recipe.white_balance_shift_blue || 0;
  if (redShift > 2 || blueShift < -2) {
    tags.push('warm', 'golden_hour');
  } else if (blueShift > 2 || redShift < -2) {
    tags.push('cool', 'overcast');
  } else if (Math.abs(redShift) <= 2 && Math.abs(blueShift) <= 2) {
    // Balanced/neutral color temperature
    tags.push('neutral', 'natural');
  }

  // Based on contrast
  const highlight = recipe.highlight || 0;
  const shadow = recipe.shadow || 0;
  if (highlight > 0 && shadow < 0) {
    tags.push('contrasty', 'dramatic');
  } else if (highlight < 0 && shadow > 0) {
    tags.push('soft', 'dreamy');
  }
  if (shadow > 1) {
    tags.push('low_light', 'indoor');
  }

  // Based on grain
  if (recipe.grain_effect === 'Strong') {
    tags.push('filmic', 'vintage', 'street');
  }

  // Based on Color Chrome
  if (recipe.color_chrome_effect === 'Strong') {
    tags.push('vibrant', 'nature', 'landscape');
  }

  // Based on dynamic range
  if (recipe.dynamic_range === 'DR400') {
    tags.push('landscape', 'daylight', 'harsh_light');
  }

  // Based on saturation (color setting)
  const color = recipe.color || 0;
  if (color >= 2) {
    tags.push('vibrant');
  } else if (color <= -2) {
    tags.push('muted', 'pastel');
  }

  // Based on name keywords - be thorough
  const nameLower = recipe.name.toLowerCase();

  // Portrait related
  if (nameLower.includes('portra') || nameLower.includes('portrait')) {
    tags.push('portrait', 'warm', 'filmic', 'golden_hour', 'soft_light');
  }

  // Film stocks
  if (nameLower.includes('kodak')) tags.push('filmic', 'vintage', 'warm');
  if (nameLower.includes('fujicolor') || nameLower.includes('superia') || nameLower.includes('reala')) {
    tags.push('filmic', 'natural', 'daylight');
  }
  if (nameLower.includes('natura')) tags.push('low_light', 'indoor', 'night');
  if (nameLower.includes('velvia')) tags.push('vibrant', 'landscape', 'nature');
  if (nameLower.includes('ektachrome')) tags.push('vibrant', 'travel', 'daylight');
  if (nameLower.includes('vision') || nameLower.includes('cine')) tags.push('cinematic', 'moody');

  // Time/lighting
  if (nameLower.includes('night') || nameLower.includes('neon')) tags.push('night', 'low_light', 'urban', 'city');
  if (nameLower.includes('golden') || nameLower.includes('sunset')) tags.push('golden_hour', 'warm', 'portrait');
  if (nameLower.includes('blue hour')) tags.push('blue_hour', 'cool', 'moody');
  if (nameLower.includes('indoor') || nameLower.includes('low light')) tags.push('indoor', 'low_light');

  // Seasons
  if (nameLower.includes('summer') || nameLower.includes('sun')) tags.push('summer', 'warm', 'daylight', 'beach');
  if (nameLower.includes('autumn') || nameLower.includes('fall')) tags.push('autumn', 'warm', 'earthy');
  if (nameLower.includes('winter') || nameLower.includes('cold')) tags.push('winter', 'cool');
  if (nameLower.includes('spring')) tags.push('spring', 'soft', 'pastel');

  // Styles
  if (nameLower.includes('vintage') || nameLower.includes('retro') || nameLower.includes('nostalgic')) {
    tags.push('vintage', 'filmic');
  }
  if (nameLower.includes('cinematic') || nameLower.includes('cinema') || nameLower.includes('movie')) {
    tags.push('cinematic', 'moody', 'dramatic');
  }
  if (nameLower.includes('street')) tags.push('street', 'urban', 'city', 'documentary');
  if (nameLower.includes('landscape')) tags.push('landscape', 'nature', 'travel');
  if (nameLower.includes('b&w') || nameLower.includes('black') || nameLower.includes('mono')) tags.push('monochrome');
  if (nameLower.includes('pastel') || nameLower.includes('soft') || nameLower.includes('dreamy')) {
    tags.push('pastel', 'soft', 'dreamy');
  }

  // Locations
  if (nameLower.includes('california') || nameLower.includes('beach') || nameLower.includes('pacific')) {
    tags.push('beach', 'summer', 'travel');
  }
  if (nameLower.includes('urban') || nameLower.includes('city')) tags.push('urban', 'city', 'street');

  // Remove duplicates
  const uniqueTags = [...new Set(tags)];

  // Get tag IDs and insert
  for (const tagName of uniqueTags) {
    const tag = queryOne(db, 'SELECT id FROM tags WHERE name = ?', [tagName]);
    if (tag) {
      try {
        run(db, 'INSERT OR IGNORE INTO recipe_tags (recipe_id, tag_id, weight) VALUES (?, ?, 1.0)', [recipeId, tag.id]);
      } catch (e) {
        // Ignore duplicate errors
      }
    }
  }
}

// Associate recipe with all cameras
async function associateWithCameras(recipeId) {
  const db = await getDb();
  const cameras = queryAll(db, 'SELECT id FROM cameras');

  for (const camera of cameras) {
    try {
      run(db, 'INSERT OR IGNORE INTO recipe_cameras (recipe_id, camera_id) VALUES (?, ?)', [recipeId, camera.id]);
    } catch (e) {
      // Ignore duplicate errors
    }
  }
}

// Import multiple recipes
export async function importRecipes(scrapedRecipes, options = {}) {
  const results = {
    imported: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    details: []
  };

  for (const recipe of scrapedRecipes) {
    try {
      const result = await importRecipe(recipe, options);
      results[result.status]++;
      results.details.push(result);
    } catch (error) {
      results.failed++;
      results.details.push({
        status: 'failed',
        name: recipe.name || 'Unknown',
        error: error.message
      });
      console.error(`Failed to import ${recipe.name}: ${error.message}`);
    }
  }

  return results;
}

export default {
  importRecipe,
  importRecipes,
  normalizeRecipe,
  recipeExists
};
