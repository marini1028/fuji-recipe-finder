import https from 'https';
import http from 'http';

// Rate limiting - be respectful to the source sites
const DELAY_BETWEEN_REQUESTS = 1500; // 1.5 seconds

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Decode HTML entities
function decodeHtmlEntities(text) {
  return text
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#038;/g, '&')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
}

// Simple HTML fetch function
function fetchPage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const request = client.get(url, {
      headers: {
        'User-Agent': 'FujiRecipeFinder/1.0 (Recipe aggregator for personal use)',
        'Accept': 'text/html,application/xhtml+xml',
      }
    }, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // Handle redirects
        return fetchPage(response.headers.location).then(resolve).catch(reject);
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    });

    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Parse Fuji X Weekly recipe page
export function parseFujiXWeeklyRecipe(html, url) {
  const recipe = {
    source: 'fujixweekly',
    sourceUrl: url,
    name: '',
    description: '',
    filmSimulation: '',
    whiteBalance: 'Auto',
    whiteBalanceShiftRed: 0,
    whiteBalanceShiftBlue: 0,
    dynamicRange: 'DR100',
    highlight: 0,
    shadow: 0,
    color: 0,
    sharpness: 0,
    noiseReduction: 0,
    clarity: 0,
    grainEffect: 'Off',
    grainSize: 'Small',
    colorChromeEffect: 'Off',
    colorChromeFxBlue: 'Off',
    exposureCompensation: '0',
    sampleImages: []
  };

  // Extract title
  const titleMatch = html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i) ||
                     html.match(/<title>([^<|]+)/i);
  if (titleMatch) {
    recipe.name = decodeHtmlEntities(titleMatch[1].trim())
      .replace(/ – Fuji X Weekly$/, '')
      .replace(/ Fujifilm.*Film Simulation Recipe.*$/i, '')
      .replace(/\s*[—–-]\s*$/, '') // Remove trailing dashes
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Description will be auto-generated from settings
  recipe.description = '';

  // Helper to extract settings - FXW uses various formats
  const extractSetting = (patterns) => {
    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) return match[1].trim();
    }
    return null;
  };

  // Known film simulation names
  const knownFilmSims = [
    'Classic Chrome', 'Classic Neg', 'Nostalgic Neg', 'Velvia', 'Astia',
    'Provia', 'Pro Neg Hi', 'Pro Neg Std', 'Eterna', 'Eterna Bleach Bypass',
    'Acros', 'Acros+R', 'Acros+G', 'Acros+Ye', 'Reala Ace', 'Monochrome',
    'Monochrome+R', 'Monochrome+G', 'Monochrome+Ye', 'Sepia'
  ];

  // Try to find a known film simulation in the HTML
  let foundFilmSim = null;
  for (const sim of knownFilmSims) {
    const regex = new RegExp(`Film Simulation[:\\s]*[^>]*${sim.replace('+', '\\+')}`, 'i');
    if (regex.test(html)) {
      foundFilmSim = sim;
      break;
    }
  }

  if (foundFilmSim) {
    recipe.filmSimulation = foundFilmSim;
  } else {
    // Try to infer from recipe name
    const nameLower = recipe.name.toLowerCase();
    if (nameLower.includes('nostalgic') || nameLower.includes('nostalgia')) {
      recipe.filmSimulation = 'Nostalgic Neg';
    } else if (nameLower.includes('classic neg')) {
      recipe.filmSimulation = 'Classic Neg';
    } else if (nameLower.includes('velvia') || nameLower.includes('vivid')) {
      recipe.filmSimulation = 'Velvia';
    } else if (nameLower.includes('astia')) {
      recipe.filmSimulation = 'Astia';
    } else if (nameLower.includes('eterna') && nameLower.includes('bleach')) {
      recipe.filmSimulation = 'Eterna Bleach Bypass';
    } else if (nameLower.includes('eterna') || nameLower.includes('cinema') || nameLower.includes('cinematic')) {
      recipe.filmSimulation = 'Eterna';
    } else if (nameLower.includes('acros') || nameLower.includes('b&w') || nameLower.includes('black')) {
      recipe.filmSimulation = 'Acros';
    } else if (nameLower.includes('provia')) {
      recipe.filmSimulation = 'Provia';
    } else if (nameLower.includes('reala')) {
      recipe.filmSimulation = 'Reala Ace';
    } else if (nameLower.includes('pro neg')) {
      recipe.filmSimulation = 'Pro Neg Hi';
    } else {
      // Default to Classic Chrome as it's most common
      recipe.filmSimulation = 'Classic Chrome';
    }
  }

  // White Balance
  const wb = extractSetting([
    /White Balance[:\s]*<[^>]*>?\s*([^<\n]+)/i,
    /White Balance[:\s]+([^<\n]+?)(?:\s*<|\s*\n)/i,
    /<strong>White Balance[:\s]*<\/strong>\s*([^<\n]+)/i
  ]);
  if (wb) {
    recipe.whiteBalance = wb.replace(/\s+/g, ' ').trim();

    // Parse WB shift values like "+1 Red & -6 Blue" or "R: +1, B: -2"
    const redMatch = wb.match(/([+-]?\d+)\s*Red/i) || wb.match(/R[:\s]*([+-]?\d+)/i);
    const blueMatch = wb.match(/([+-]?\d+)\s*Blue/i) || wb.match(/B[:\s]*([+-]?\d+)/i);

    if (redMatch) recipe.whiteBalanceShiftRed = parseInt(redMatch[1]);
    if (blueMatch) recipe.whiteBalanceShiftBlue = parseInt(blueMatch[1]);

    // Extract base WB (Kelvin or preset)
    const kelvMatch = wb.match(/(\d{4})K/i);
    if (kelvMatch) {
      recipe.whiteBalance = `${kelvMatch[1]}K`;
    } else {
      const presetMatch = wb.match(/(Auto|Daylight|Shade|Cloudy|Fluorescent\s*\d*|Incandescent|Underwater)/i);
      if (presetMatch) {
        recipe.whiteBalance = presetMatch[1];
      }
    }
  }

  // Dynamic Range
  const dr = extractSetting([
    /Dynamic Range[:\s]*<[^>]*>?\s*(DR?\s*\d+)/i,
    /Dynamic Range[:\s]+(DR?\s*\d+)/i,
    /<strong>Dynamic Range[:\s]*<\/strong>\s*(DR?\s*\d+)/i
  ]);
  if (dr) {
    recipe.dynamicRange = dr.toUpperCase().replace(/\s+/g, '');
    if (!recipe.dynamicRange.startsWith('DR')) {
      recipe.dynamicRange = 'DR' + recipe.dynamicRange;
    }
  }

  // Numeric settings
  const numericSettings = [
    { key: 'highlight', patterns: [/Highlight[:\s]*([+-]?\d+)/i] },
    { key: 'shadow', patterns: [/Shadow[:\s]*([+-]?\d+)/i] },
    { key: 'color', patterns: [/(?<!Chrome\s)Color[:\s]*([+-]?\d+)/i, /^Color[:\s]*([+-]?\d+)/im] },
    { key: 'sharpness', patterns: [/Sharpness[:\s]*([+-]?\d+)/i] },
    { key: 'noiseReduction', patterns: [/(?:Noise Reduction|High ISO NR|NR)[:\s]*([+-]?\d+)/i] },
    { key: 'clarity', patterns: [/Clarity[:\s]*([+-]?\d+)/i] },
  ];

  for (const { key, patterns } of numericSettings) {
    const value = extractSetting(patterns);
    if (value) {
      recipe[key] = parseInt(value);
    }
  }

  // Grain Effect
  const grain = extractSetting([
    /Grain Effect[:\s]*<[^>]*>?\s*([^<\n]+)/i,
    /Grain Effect[:\s]+([^<\n]+?)(?:\s*<|\s*\n)/i
  ]);
  if (grain) {
    const grainLower = grain.toLowerCase();
    if (grainLower.includes('off')) {
      recipe.grainEffect = 'Off';
    } else if (grainLower.includes('strong')) {
      recipe.grainEffect = 'Strong';
    } else if (grainLower.includes('weak')) {
      recipe.grainEffect = 'Weak';
    }

    if (grainLower.includes('large')) {
      recipe.grainSize = 'Large';
    } else if (grainLower.includes('small')) {
      recipe.grainSize = 'Small';
    }
  }

  // Color Chrome Effect
  const cce = extractSetting([
    /Color Chrome Effect[:\s]*<[^>]*>?\s*([^<\n]+)/i,
    /Color Chrome Effect[:\s]+([^<\n]+?)(?:\s*<|\s*\n)/i
  ]);
  if (cce) {
    const cceLower = cce.toLowerCase();
    if (cceLower.includes('off')) {
      recipe.colorChromeEffect = 'Off';
    } else if (cceLower.includes('strong')) {
      recipe.colorChromeEffect = 'Strong';
    } else if (cceLower.includes('weak')) {
      recipe.colorChromeEffect = 'Weak';
    }
  }

  // Color Chrome FX Blue
  const ccfxb = extractSetting([
    /Color Chrome (?:FX )?Blue[:\s]*<[^>]*>?\s*([^<\n]+)/i,
    /Color Chrome (?:FX )?Blue[:\s]+([^<\n]+?)(?:\s*<|\s*\n)/i
  ]);
  if (ccfxb) {
    const ccfxbLower = ccfxb.toLowerCase();
    if (ccfxbLower.includes('off')) {
      recipe.colorChromeFxBlue = 'Off';
    } else if (ccfxbLower.includes('strong')) {
      recipe.colorChromeFxBlue = 'Strong';
    } else if (ccfxbLower.includes('weak')) {
      recipe.colorChromeFxBlue = 'Weak';
    }
  }

  // Exposure Compensation
  const exp = extractSetting([
    /Exposure Compensation[:\s]*([+-]?\d+(?:\/\d+)?(?:\s*to\s*[+-]?\d+(?:\/\d+)?)?)/i,
    /Exposure[:\s]*([+-]?\d+(?:\/\d+)?)/i
  ]);
  if (exp) {
    recipe.exposureCompensation = exp.split(/\s*to\s*/)[0].trim();
  }

  // Extract sample images
  const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
  const seenUrls = new Set();

  for (const match of imgMatches) {
    let imgUrl = match[1];

    // Skip small images, icons, avatars, etc.
    if (imgUrl.includes('gravatar') ||
        imgUrl.includes('icon') ||
        imgUrl.includes('logo') ||
        imgUrl.includes('avatar') ||
        imgUrl.includes('-150x') ||
        imgUrl.includes('-100x') ||
        imgUrl.includes('emoji')) {
      continue;
    }

    // Only include WordPress uploads (actual content images)
    if (imgUrl.includes('/wp-content/uploads/')) {
      // Get a reasonable size
      imgUrl = imgUrl.replace(/-\d+x\d+\./, '.');

      // Ensure full URL
      if (imgUrl.startsWith('//')) {
        imgUrl = 'https:' + imgUrl;
      } else if (imgUrl.startsWith('/')) {
        imgUrl = 'https://fujixweekly.com' + imgUrl;
      }

      if (!seenUrls.has(imgUrl) && recipe.sampleImages.length < 6) {
        seenUrls.add(imgUrl);
        recipe.sampleImages.push(imgUrl);
      }
    }
  }

  return recipe;
}

// Parse Fujifilm Simulations recipe page
export function parseFujifilmSimulationsRecipe(html, url) {
  const recipe = {
    source: 'fujifilmsimulations',
    sourceUrl: url,
    name: '',
    description: '',
    filmSimulation: '',
    whiteBalance: 'Auto',
    whiteBalanceShiftRed: 0,
    whiteBalanceShiftBlue: 0,
    dynamicRange: 'DR100',
    highlight: 0,
    shadow: 0,
    color: 0,
    sharpness: 0,
    noiseReduction: 0,
    clarity: 0,
    grainEffect: 'Off',
    grainSize: 'Small',
    colorChromeEffect: 'Off',
    colorChromeFxBlue: 'Off',
    exposureCompensation: '0',
    sampleImages: []
  };

  // Extract title - try multiple patterns
  // Look for the project title specifically
  const titlePatterns = [
    /<h1[^>]*class="[^"]*project-title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h2[^>]*class="[^"]*project-title[^"]*"[^>]*>([^<]+)<\/h2>/i,
    /<title>([^<|–-]+)/i
  ];

  for (const pattern of titlePatterns) {
    const match = html.match(pattern);
    if (match && match[1].trim() !== 'Recipes' && match[1].trim().length > 2) {
      recipe.name = decodeHtmlEntities(match[1].trim())
        .replace(/\s*[-–|].*$/, '') // Remove trailing site name
        .trim();
      break;
    }
  }

  // If still no name, try to get it from the URL
  if (!recipe.name || recipe.name === 'Recipes') {
    const urlMatch = url.match(/\/project\/([^\/]+)\/?$/);
    if (urlMatch) {
      recipe.name = urlMatch[1]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }
  }

  // Helper to extract settings - handle various HTML structures
  const extractSetting = (name) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
      // Pattern: <span>Setting Name</span> followed by value
      new RegExp(`<span[^>]*>${escapedName}<\\/span>\\s*:?\\s*<[^>]*>([^<]+)<`, 'i'),
      // Pattern: Setting Name in text followed by value
      new RegExp(`>${escapedName}<\\/[^>]+>\\s*<[^>]*>([^<]+)<`, 'i'),
      // Pattern: Setting Name: Value in same element
      new RegExp(`${escapedName}\\s*:?\\s*</[^>]+>\\s*<[^>]*>\\s*([^<]+)`, 'i'),
      // Pattern: data attribute or simple text
      new RegExp(`${escapedName}[\\s:]+([^<\\n]+?)(?:<|\n)`, 'i'),
      // Pattern: td/th structure
      new RegExp(`<t[dh][^>]*>\\s*${escapedName}\\s*<\\/t[dh]>\\s*<t[dh][^>]*>([^<]+)`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match && match[1].trim()) {
        return decodeHtmlEntities(match[1].trim());
      }
    }
    return null;
  };

  // Known film simulation names
  const knownFilmSims = [
    'Classic Chrome', 'Classic Neg', 'Nostalgic Neg', 'Velvia', 'Astia',
    'Provia', 'Pro Neg Hi', 'Pro Neg Std', 'Eterna', 'Eterna Bleach Bypass',
    'Acros', 'Acros+R', 'Acros+G', 'Acros+Ye', 'Reala Ace', 'Monochrome'
  ];

  // Film Simulation - try extraction then search for known names
  const filmSim = extractSetting('Film Simulation');
  if (filmSim) {
    // Check if it contains a known film simulation
    for (const sim of knownFilmSims) {
      if (filmSim.toLowerCase().includes(sim.toLowerCase())) {
        recipe.filmSimulation = sim;
        break;
      }
    }
    if (!recipe.filmSimulation) {
      recipe.filmSimulation = filmSim;
    }
  }

  // Also search the whole HTML for film simulation mentions
  if (!recipe.filmSimulation) {
    for (const sim of knownFilmSims) {
      const regex = new RegExp(`Film Simulation[^<]*${sim.replace('+', '\\+')}`, 'i');
      if (regex.test(html)) {
        recipe.filmSimulation = sim;
        break;
      }
    }
  }

  // Grain Effect
  const grain = extractSetting('Grain Effect');
  if (grain) {
    const grainLower = grain.toLowerCase();
    if (grainLower.includes('strong')) recipe.grainEffect = 'Strong';
    else if (grainLower.includes('weak')) recipe.grainEffect = 'Weak';
    else if (grainLower.includes('off')) recipe.grainEffect = 'Off';

    if (grainLower.includes('large')) recipe.grainSize = 'Large';
    else if (grainLower.includes('small')) recipe.grainSize = 'Small';
  }

  // Color Chrome Effect
  const cce = extractSetting('Color Chrome Effect');
  if (cce) {
    const cceLower = cce.toLowerCase();
    if (cceLower.includes('strong')) recipe.colorChromeEffect = 'Strong';
    else if (cceLower.includes('weak')) recipe.colorChromeEffect = 'Weak';
    else recipe.colorChromeEffect = 'Off';
  }

  // Color Chrome FX Blue
  const ccfxb = extractSetting('Color Chrome FX Blue') || extractSetting('CC FX Blue');
  if (ccfxb) {
    const lower = ccfxb.toLowerCase();
    if (lower.includes('strong')) recipe.colorChromeFxBlue = 'Strong';
    else if (lower.includes('weak')) recipe.colorChromeFxBlue = 'Weak';
    else recipe.colorChromeFxBlue = 'Off';
  }

  // White Balance
  const wb = extractSetting('White Balance');
  if (wb) {
    const redMatch = wb.match(/\+?(\d+)\s*Red/i) || wb.match(/Red[:\s]*\+?(\d+)/i);
    const blueMatch = wb.match(/([+-]?\d+)\s*Blue/i) || wb.match(/Blue[:\s]*([+-]?\d+)/i);
    if (redMatch) recipe.whiteBalanceShiftRed = parseInt(redMatch[1]);
    if (blueMatch) recipe.whiteBalanceShiftBlue = parseInt(blueMatch[1]);

    const kelvMatch = wb.match(/(\d{4})K?/);
    if (kelvMatch) {
      recipe.whiteBalance = `${kelvMatch[1]}K`;
    } else if (wb.toLowerCase().includes('auto')) {
      recipe.whiteBalance = 'Auto';
    } else if (wb.toLowerCase().includes('daylight')) {
      recipe.whiteBalance = 'Daylight';
    }
  }

  // Dynamic Range
  const dr = extractSetting('Dynamic Range');
  if (dr) {
    const drMatch = dr.match(/DR?\s*(\d+)/i);
    if (drMatch) {
      recipe.dynamicRange = `DR${drMatch[1]}`;
    }
  }

  // Numeric settings - parse values like "+1.5", "-2", "0"
  const numericFields = [
    { name: 'Highlight', key: 'highlight' },
    { name: 'Shadow', key: 'shadow' },
    { name: 'Color', key: 'color' },
    { name: 'Sharpness', key: 'sharpness' },
    { name: 'Noise Reduction', key: 'noiseReduction' },
    { name: 'Clarity', key: 'clarity' }
  ];

  for (const { name, key } of numericFields) {
    const value = extractSetting(name);
    if (value) {
      const numMatch = value.match(/([+-]?\d+(?:\.\d+)?)/);
      if (numMatch) {
        recipe[key] = Math.round(parseFloat(numMatch[1]));
      }
    }
  }

  // Exposure Compensation
  const exp = extractSetting('Exp. Compensation') || extractSetting('Exposure Compensation');
  if (exp) {
    const expMatch = exp.match(/([+-]?\d+(?:\/\d+)?)/);
    if (expMatch) {
      recipe.exposureCompensation = expMatch[1];
    }
  }

  // Extract images - be more selective for fujifilmsimulations.com
  const imgMatches = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
  const seenUrls = new Set();

  for (const match of imgMatches) {
    let imgUrl = match[1];

    // Skip icons, logos, small images
    if (imgUrl.includes('icon') ||
        imgUrl.includes('logo') ||
        imgUrl.includes('avatar') ||
        imgUrl.includes('Artboard') ||
        imgUrl.includes('-150x') ||
        imgUrl.includes('-100x')) {
      continue;
    }

    // Only include content images
    if (imgUrl.includes('/wp-content/uploads/') && imgUrl.match(/\.(jpg|jpeg|png|webp)/i)) {
      if (imgUrl.startsWith('/')) {
        imgUrl = 'https://fujifilmsimulations.com' + imgUrl;
      }

      // Remove size suffixes to get full image
      imgUrl = imgUrl.replace(/-\d+x\d+\./, '.');

      if (!seenUrls.has(imgUrl) && recipe.sampleImages.length < 6) {
        seenUrls.add(imgUrl);
        recipe.sampleImages.push(imgUrl);
      }
    }
  }

  return recipe;
}

// Fetch and parse a single recipe
export async function fetchRecipe(url) {
  console.log(`Fetching: ${url}`);

  const html = await fetchPage(url);

  if (url.includes('fujixweekly.com')) {
    return parseFujiXWeeklyRecipe(html, url);
  } else if (url.includes('fujifilmsimulations.com')) {
    return parseFujifilmSimulationsRecipe(html, url);
  } else {
    throw new Error('Unsupported recipe source');
  }
}

// Get list of recipe URLs from Fuji X Weekly category page
export async function getFujiXWeeklyRecipeList(categoryUrl) {
  console.log(`Fetching recipe list from: ${categoryUrl}`);

  const html = await fetchPage(categoryUrl);
  const urls = [];

  // Match recipe links
  const linkMatches = html.matchAll(/href=["'](https:\/\/fujixweekly\.com\/\d{4}\/\d{2}\/\d{2}\/[^"']+recipe[^"']*)["']/gi);

  const seen = new Set();
  for (const match of linkMatches) {
    const url = match[1];
    if (!seen.has(url)) {
      seen.add(url);
      urls.push(url);
    }
  }

  return urls;
}

// Scrape all recipes from a category
export async function scrapeCategory(categoryUrl, limit = 50) {
  const recipeUrls = await getFujiXWeeklyRecipeList(categoryUrl);
  console.log(`Found ${recipeUrls.length} recipes`);

  const recipes = [];
  const urlsToFetch = recipeUrls.slice(0, limit);

  for (let i = 0; i < urlsToFetch.length; i++) {
    try {
      const recipe = await fetchRecipe(urlsToFetch[i]);
      recipes.push(recipe);
      console.log(`[${i + 1}/${urlsToFetch.length}] Parsed: ${recipe.name}`);

      if (i < urlsToFetch.length - 1) {
        await sleep(DELAY_BETWEEN_REQUESTS);
      }
    } catch (error) {
      console.error(`Failed to fetch ${urlsToFetch[i]}: ${error.message}`);
    }
  }

  return recipes;
}

// Predefined category URLs
export const FUJI_X_WEEKLY_CATEGORIES = {
  'x-trans-v': 'https://fujixweekly.com/fujifilm-x-trans-v-recipes/',
  'x-trans-iv': 'https://fujixweekly.com/fujifilm-x-trans-iv-recipes/',
  'x-trans-iii': 'https://fujixweekly.com/fujifilm-x-trans-iii-recipes/',
  'gfx': 'https://fujixweekly.com/fujifilm-gfx-recipes/'
};

export default {
  fetchRecipe,
  scrapeCategory,
  getFujiXWeeklyRecipeList,
  parseFujiXWeeklyRecipe,
  parseFujifilmSimulationsRecipe,
  FUJI_X_WEEKLY_CATEGORIES
};
