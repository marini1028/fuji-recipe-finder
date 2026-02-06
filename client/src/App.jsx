import { useState, useEffect } from 'react'
import Header from './components/Header'
import StructuredForm from './components/StructuredForm'
import NaturalLanguageInput from './components/NaturalLanguageInput'
import ResultsPage from './components/ResultsPage'
import FavoritesPage from './components/FavoritesPage'
import CompareView from './components/CompareView'

// Load favorites from localStorage
const loadFavorites = () => {
  try {
    const saved = localStorage.getItem('fuji-recipe-favorites')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Save favorites to localStorage
const saveFavorites = (favorites) => {
  localStorage.setItem('fuji-recipe-favorites', JSON.stringify(favorites))
}

function App() {
  const [view, setView] = useState('search') // 'search', 'results', 'favorites', 'compare'
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [compareList, setCompareList] = useState([])

  // Save favorites whenever they change
  useEffect(() => {
    saveFavorites(favorites)
  }, [favorites])

  const handleStructuredSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/recommend/structured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendations')
      }

      const data = await response.json()
      setResults({ type: 'structured', recommendations: data })
      setView('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNaturalSubmit = async (prompt) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/recommend/natural', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      if (!response.ok) {
        throw new Error('Failed to get recommendations')
      }

      const data = await response.json()
      setResults({
        type: 'natural',
        parsed: data.parsed,
        recommendations: data.recommendations
      })
      setView('results')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResults(null)
    setError(null)
    setView('search')
  }

  const toggleFavorite = (recipe) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === recipe.id)
      if (exists) {
        return prev.filter(f => f.id !== recipe.id)
      }
      return [...prev, recipe]
    })
  }

  const isFavorite = (recipeId) => {
    return favorites.some(f => f.id === recipeId)
  }

  const toggleCompare = (recipe) => {
    setCompareList(prev => {
      const exists = prev.find(r => r.id === recipe.id)
      if (exists) {
        return prev.filter(r => r.id !== recipe.id)
      }
      if (prev.length >= 4) {
        return prev // Max 4 recipes to compare
      }
      return [...prev, recipe]
    })
  }

  const isInCompareList = (recipeId) => {
    return compareList.some(r => r.id === recipeId)
  }

  const clearCompareList = () => {
    setCompareList([])
  }

  const renderContent = () => {
    switch (view) {
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            onBack={() => setView('search')}
            onRemoveFavorite={toggleFavorite}
            onToggleCompare={toggleCompare}
            isInCompareList={isInCompareList}
            compareCount={compareList.length}
            onOpenCompare={() => setView('compare')}
          />
        )

      case 'compare':
        return (
          <CompareView
            recipes={compareList}
            onBack={() => setView(favorites.length > 0 ? 'favorites' : 'search')}
            onRemove={(recipe) => toggleCompare(recipe)}
            onClear={clearCompareList}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )

      case 'results':
        return (
          <ResultsPage
            results={results}
            onReset={handleReset}
            onToggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            onToggleCompare={toggleCompare}
            isInCompareList={isInCompareList}
            compareCount={compareList.length}
            onOpenCompare={() => setView('compare')}
          />
        )

      default:
        return (
          <div className="search-view">
            <NaturalLanguageInput onSubmit={handleNaturalSubmit} loading={loading} />

            <div className="divider">
              <span>or use detailed options</span>
            </div>

            <StructuredForm onSubmit={handleStructuredSubmit} loading={loading} />

            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="app">
      <Header
        onShowFavorites={() => setView('favorites')}
        onShowSearch={() => setView('search')}
        favoritesCount={favorites.length}
        currentView={view}
      />

      <main className="main-content">
        {renderContent()}

        {/* Floating compare button */}
        {compareList.length >= 2 && view !== 'compare' && (
          <button
            className="floating-compare-btn"
            onClick={() => setView('compare')}
          >
            Compare {compareList.length} Recipes
          </button>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <span className="footer-brand">Fuji Recipe Finder</span>
          <span className="footer-divider">|</span>
          <span className="footer-credit">Background Image © 2025 Marini Qian</span>
        </div>
      </footer>
    </div>
  )
}

export default App
