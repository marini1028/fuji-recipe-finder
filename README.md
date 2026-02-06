# Fuji Recipe Finder

A web-based platform that recommends Fujifilm film simulation recipes based on shooting conditions and creative preferences. Features both structured form input and natural language processing modes, plus the ability to save favorites and compare recipes.

## Features

- **Structured Form Mode**: Select your shooting conditions through dropdown menus
- **Natural Language Mode**: Describe your shooting scenario in plain English
- **Smart Recommendations**: Algorithm scores and ranks recipes based on your inputs
- **Save Favorites**: Save your favorite recipes for quick access (stored in browser)
- **Compare Recipes**: Compare up to 4 recipes side-by-side to see setting differences
- **44 Curated Recipes**: Sourced from FujiXWeekly and FujifilmSimulations, including Portra 400, Kodachrome, Cinematic looks, and more
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

## Recipe Sources

The app includes 44 curated recipes from popular Fujifilm photography communities:
- **FujiXWeekly** - Classic film emulations and creative looks
- **FujifilmSimulations** - Community-submitted recipes with sample images

Each recipe includes full camera settings: film simulation, white balance, dynamic range, highlight/shadow, color, sharpness, noise reduction, clarity, grain effect, and color chrome settings.

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

## Deployment to Google Cloud Run

### How It Works

```
User visits fujirecipefinder.com
        ↓
DNS (A Records) → Points to Google Cloud IPs
        ↓
Google Cloud Run → Routes to your container
        ↓
Docker Container → Express serves React + API
        ↓
SQLite Database → Returns recipe data
```

### Prerequisites
- Google Cloud account with billing enabled
- `gcloud` CLI installed
- Domain name (optional)

### Deploy Steps

1. **Authenticate with Google Cloud:**
   ```bash
   gcloud auth login
   ```

2. **Create a new project:**
   ```bash
   gcloud projects create fuji-recipe-finder --name="Fuji Recipe Finder"
   gcloud config set project fuji-recipe-finder
   ```

3. **Enable billing:**
   Go to https://console.cloud.google.com/billing/linkedaccount?project=fuji-recipe-finder and link a billing account (required even for free tier)

4. **Enable required APIs:**
   ```bash
   gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
   ```

5. **Deploy:**
   ```bash
   gcloud run deploy fuji-recipe-finder \
     --source . \
     --region us-central1 \
     --allow-unauthenticated \
     --memory 512Mi \
     --min-instances 0 \
     --max-instances 2
   ```

6. **Get your URL:**
   After deployment, you'll receive a URL like `https://fuji-recipe-finder-XXXXX.us-central1.run.app`

### Custom Domain Setup

1. **Verify domain ownership:**
   - Go to https://www.google.com/webmasters/verification/home
   - Add your domain and get a TXT record
   - Add the TXT record in your domain registrar

2. **Create domain mapping:**
   ```bash
   gcloud beta run domain-mappings create \
     --service fuji-recipe-finder \
     --domain yourdomain.com \
     --region us-central1
   ```

3. **Add DNS records** in your domain registrar:
   | Type | Host | Value |
   |------|------|-------|
   | A | @ | 216.239.32.21 |
   | A | @ | 216.239.34.21 |
   | A | @ | 216.239.36.21 |
   | A | @ | 216.239.38.21 |

4. **Wait for SSL certificate provisioning** (5-20 minutes)

### Cost Estimates

Cloud Run free tier includes:
- 2 million requests/month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

For a low-traffic personal project, expect **$0-5/month**.

## Credits

- **Recipes**: Sourced from [FujiXWeekly](https://fujixweekly.com) and [FujifilmSimulations](https://fujifilmsimulations.com)
- **Sample Images**: From the respective recipe sources
- **Background Image**: © 2025 Marini Qian

## License

MIT
