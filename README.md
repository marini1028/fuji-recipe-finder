# Fuji Recipe Finder

A web-based platform that recommends Fujifilm film simulation recipes based on shooting conditions and creative preferences. Features both structured form input and natural language processing modes, plus the ability to save favorites and compare recipes.

## Features

- **Structured Form Mode**: Select your shooting conditions through dropdown menus
- **Natural Language Mode**: Describe your shooting scenario in plain English
- **Smart Recommendations**: Algorithm scores and ranks recipes based on your inputs
- **Save Favorites**: Save your favorite recipes for quick access (stored in browser)
- **Compare Recipes**: Compare up to 4 recipes side-by-side to see setting differences
- **20 Curated Recipes**: Popular Fujifilm recipes including Portra 400, Kodachrome, Cinematic looks, and more
- **Detailed Settings**: Full camera settings for each recipe including WB, DR, grain, color chrome, etc.

## Tech Stack

- **Frontend**: React (Vite)
- **Backend**: Express.js + SQLite
- **NLP**: OpenAI API for natural language parsing (with fallback keyword matching)
- **Styling**: CSS with mobile-first responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- (Optional) OpenAI API key for enhanced NLP features

### Installation

1. **Clone/navigate to the project directory**

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   ```

4. **Set up environment variables** (optional, for OpenAI integration)
   ```bash
   # Create .env file in server directory
   echo "OPENAI_API_KEY=your_key_here" > .env
   ```

5. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server** (in one terminal)
   ```bash
   cd server
   npm start
   ```
   Server runs on http://localhost:3001

2. **Start the frontend** (in another terminal)
   ```bash
   cd client
   npm run dev
   ```
   Client runs on http://localhost:5173

3. **Open your browser** to http://localhost:5173

## Usage

### Structured Form Mode
1. Select your shooting conditions from the dropdowns:
   - Lighting (daylight, golden hour, night, etc.)
   - Subject (portrait, street, landscape, etc.)
   - Mood (cinematic, vintage, dreamy, etc.)
   - Color preference (warm, cool, vibrant, B&W, etc.)
   - Location (city, beach, cafe, etc.)
   - Season

2. Click "Get Recommendations"

3. View your top 3 recipe matches with explanations

### Natural Language Mode
1. Describe your shooting scenario, for example:
   - "Best recipe for low light portraits"
   - "Moody street photography at night in Tokyo"
   - "Bright sunny beach photos with vibrant colors"

2. Click "Find Recipes"

3. View detected parameters and top 3 recipe matches

### Saving Favorites
- Click the heart icon on any recipe card to save it
- Access your saved recipes from the "Favorites" tab in the header
- Favorites are stored in your browser's localStorage

### Comparing Recipes
1. Click the "Compare" button on any recipe card
2. Select 2-4 recipes to compare
3. Click "Compare Now" to see a side-by-side comparison
4. Differences between recipes are highlighted in the comparison table

## API Endpoints

- `GET /api/recipes` - List all recipes
- `GET /api/recipes/:id` - Get single recipe details
- `POST /api/recommend/structured` - Form-based recommendation
- `POST /api/recommend/natural` - Natural language recommendation
- `GET /api/health` - Health check

## Included Recipes

1. Classic Chrome Everyday
2. Portra 400 Inspired
3. Kodachrome Vibrant
4. Cinematic Teal & Orange
5. High Contrast B&W
6. Soft Pastel Dream
7. Superia 400 Nostalgic
8. Moody Street Night
9. Golden Hour Portrait
10. Cool Urban Modern
11. Autumn Warmth
12. Noir Classic
13. Bright & Airy
14. Vintage Fade
15. Nature Documentary
16. Rainy Day Blue
17. Warm Film Portrait
18. Beach Summer
19. Low Light Indoor
20. Harsh Daylight

## Project Structure

```
Fuji Recipe Finder/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ModeToggle.jsx
│   │   │   ├── StructuredForm.jsx
│   │   │   ├── NaturalLanguageInput.jsx
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   └── CompareView.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── server/                    # Express backend
│   ├── db/
│   │   ├── schema.sql
│   │   ├── seed.sql
│   │   ├── database.js
│   │   └── recipes.db (generated)
│   ├── routes/
│   │   ├── recipes.js
│   │   └── recommend.js
│   ├── services/
│   │   ├── nlpService.js
│   │   └── recommendationEngine.js
│   ├── index.js
│   ├── init-db.js
│   └── package.json
└── README.md
```

## License

MIT
