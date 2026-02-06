import OpenAI from 'openai';

// Lazy initialization of OpenAI client
let openai = null;

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

const systemPrompt = `You are a photography assistant that helps parse natural language descriptions into structured photography parameters.

Given a user's description of their shooting scenario, extract the following parameters:

1. lighting: One of: bright_sunlight, golden_hour, blue_hour, overcast, indoor, night, mixed
2. subject: One of: portrait, street, landscape, architecture, nature, food, travel, event
3. mood: One of: cinematic, vintage, modern, dreamy, moody, natural, dramatic, minimal
4. colorPreference: One of: warm, cool, neutral, vibrant, muted, bw, teal_orange
5. location: One of: city, nature, beach, cafe, studio, home
6. season: One of: summer, autumn, winter, spring

Return ONLY a valid JSON object with these fields. Use null for any parameter that cannot be determined from the input.

Examples:
- "I'm shooting portraits at sunset on the beach" → {"lighting":"golden_hour","subject":"portrait","mood":"dreamy","colorPreference":"warm","location":"beach","season":"summer"}
- "Moody night street photography in Tokyo" → {"lighting":"night","subject":"street","mood":"moody","colorPreference":"teal_orange","location":"city","season":null}
- "Bright sunny landscape in autumn mountains" → {"lighting":"bright_sunlight","subject":"landscape","mood":"natural","colorPreference":"vibrant","location":"nature","season":"autumn"}`;

export async function parseNaturalLanguage(prompt) {
  const client = getOpenAIClient();

  // Check if OpenAI API key is configured
  if (!client) {
    console.warn('OpenAI API key not configured, using fallback parsing');
    return fallbackParse(prompt);
  }

  try {
    const response = await client.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const content = response.choices[0].message.content.trim();

    // Parse JSON response
    const parsed = JSON.parse(content);

    // Validate and clean the response
    return validateParsedInput(parsed);
  } catch (error) {
    console.error('OpenAI parsing error:', error);
    // Fall back to keyword-based parsing
    return fallbackParse(prompt);
  }
}

function validateParsedInput(parsed) {
  const validValues = {
    lighting: ['bright_sunlight', 'golden_hour', 'blue_hour', 'overcast', 'indoor', 'night', 'mixed'],
    subject: ['portrait', 'street', 'landscape', 'architecture', 'nature', 'food', 'travel', 'event'],
    mood: ['cinematic', 'vintage', 'modern', 'dreamy', 'moody', 'natural', 'dramatic', 'minimal'],
    colorPreference: ['warm', 'cool', 'neutral', 'vibrant', 'muted', 'bw', 'teal_orange'],
    location: ['city', 'nature', 'beach', 'cafe', 'studio', 'home'],
    season: ['summer', 'autumn', 'winter', 'spring']
  };

  const result = {};

  for (const [key, validList] of Object.entries(validValues)) {
    if (parsed[key] && validList.includes(parsed[key])) {
      result[key] = parsed[key];
    }
  }

  return result;
}

// Helper function for word boundary matching
function hasWord(text, word) {
  const regex = new RegExp(`\\b${word}\\b`, 'i');
  return regex.test(text);
}

// Fallback keyword-based parsing when OpenAI is unavailable
function fallbackParse(prompt) {
  const lower = prompt.toLowerCase();
  const result = {};

  // Lighting detection
  if (lower.includes('sunset') || lower.includes('golden hour') || lower.includes('magic hour')) {
    result.lighting = 'golden_hour';
  } else if (lower.includes('night') || lower.includes('dark') || lower.includes('evening')) {
    result.lighting = 'night';
  } else if (lower.includes('indoor') || lower.includes('inside')) {
    result.lighting = 'indoor';
  } else if (lower.includes('overcast') || lower.includes('cloudy') || lower.includes('rainy')) {
    result.lighting = 'overcast';
  } else if (lower.includes('sunny') || lower.includes('bright') || lower.includes('midday')) {
    result.lighting = 'bright_sunlight';
  } else if (lower.includes('blue hour') || lower.includes('dusk') || lower.includes('dawn')) {
    result.lighting = 'blue_hour';
  } else if (lower.includes('low light')) {
    result.lighting = 'indoor';
  }

  // Subject detection
  if (lower.includes('portrait') || lower.includes('people') || lower.includes('person') || lower.includes('face')) {
    result.subject = 'portrait';
  } else if (lower.includes('street') || lower.includes('urban')) {
    result.subject = 'street';
  } else if (lower.includes('landscape') || lower.includes('scenery') || lower.includes('mountain') || lower.includes('vista')) {
    result.subject = 'landscape';
  } else if (lower.includes('architecture') || lower.includes('building')) {
    result.subject = 'architecture';
  } else if (lower.includes('nature') || lower.includes('wildlife') || lower.includes('animal') || lower.includes('flower')) {
    result.subject = 'nature';
  } else if (lower.includes('food') || lower.includes('restaurant') || lower.includes('dish')) {
    result.subject = 'food';
  } else if (lower.includes('travel') || lower.includes('vacation') || lower.includes('trip')) {
    result.subject = 'travel';
  }

  // Mood detection - use word boundaries for short words
  if (lower.includes('cinematic') || lower.includes('film') || lower.includes('movie')) {
    result.mood = 'cinematic';
  } else if (lower.includes('vintage') || lower.includes('retro') || hasWord(lower, 'old') || lower.includes('nostalgic')) {
    result.mood = 'vintage';
  } else if (lower.includes('moody') || hasWord(lower, 'dark') || lower.includes('atmospheric')) {
    result.mood = 'moody';
  } else if (lower.includes('dreamy') || hasWord(lower, 'soft') || lower.includes('ethereal') || lower.includes('airy')) {
    result.mood = 'dreamy';
  } else if (lower.includes('dramatic') || lower.includes('intense') || hasWord(lower, 'bold')) {
    result.mood = 'dramatic';
  } else if (lower.includes('natural') || lower.includes('realistic')) {
    result.mood = 'natural';
  } else if (lower.includes('modern') || lower.includes('clean') || lower.includes('minimal')) {
    result.mood = 'minimal';
  }

  // Color preference detection
  if (lower.includes('neutral') || lower.includes('natural color') || lower.includes('balanced')) {
    result.colorPreference = 'neutral';
  } else if (lower.includes('warm') || lower.includes('orange') || lower.includes('amber')) {
    result.colorPreference = 'warm';
  } else if (lower.includes('cool') || lower.includes('blue') || hasWord(lower, 'cold')) {
    result.colorPreference = 'cool';
  } else if (lower.includes('black and white') || lower.includes('b&w') || lower.includes('monochrome') || lower.includes('bw')) {
    result.colorPreference = 'bw';
  } else if (lower.includes('vibrant') || lower.includes('saturated') || lower.includes('colorful') || lower.includes('punchy')) {
    result.colorPreference = 'vibrant';
  } else if (lower.includes('muted') || lower.includes('desaturated') || lower.includes('pastel') || lower.includes('faded')) {
    result.colorPreference = 'muted';
  } else if (lower.includes('teal') || lower.includes('hollywood')) {
    result.colorPreference = 'teal_orange';
  }

  // Location detection
  if (lower.includes('city') || lower.includes('tokyo') || lower.includes('new york') || lower.includes('urban') || lower.includes('downtown')) {
    result.location = 'city';
  } else if (lower.includes('beach') || lower.includes('ocean') || lower.includes('sea') || lower.includes('coast')) {
    result.location = 'beach';
  } else if (lower.includes('cafe') || lower.includes('coffee') || lower.includes('restaurant')) {
    result.location = 'cafe';
  } else if (lower.includes('studio')) {
    result.location = 'studio';
  } else if (lower.includes('forest') || lower.includes('mountain') || lower.includes('nature') || lower.includes('outdoor') || lower.includes('park')) {
    result.location = 'nature';
  } else if (lower.includes('home') || lower.includes('house') || lower.includes('apartment')) {
    result.location = 'home';
  }

  // Season detection - use word boundaries for short words that could be substrings
  if (lower.includes('summer') || hasWord(lower, 'hot') || lower.includes('sunny')) {
    result.season = 'summer';
  } else if (lower.includes('autumn') || hasWord(lower, 'fall') || lower.includes('leaves')) {
    result.season = 'autumn';
  } else if (lower.includes('winter') || lower.includes('snow') || hasWord(lower, 'cold')) {
    result.season = 'winter';
  } else if (lower.includes('spring') || lower.includes('bloom') || lower.includes('flower')) {
    result.season = 'spring';
  }

  return result;
}
