import RecipeCard from './RecipeCard'

function ResultsPage({
  results,
  onReset,
  onToggleFavorite,
  isFavorite,
  onToggleCompare,
  isInCompareList,
  compareCount,
  onOpenCompare
}) {
  const formatParsedKey = (key) => {
    const labels = {
      lighting: 'Lighting',
      subject: 'Subject',
      mood: 'Mood',
      colorPreference: 'Color',
      location: 'Location',
      season: 'Season'
    }
    return labels[key] || key
  }

  const formatParsedValue = (value) => {
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <button className="btn btn-back" onClick={onReset}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          New Search
        </button>
        <h2 className="results-title">Recommended Recipes</h2>
      </div>

      {results.type === 'natural' && results.parsed && Object.keys(results.parsed).length > 0 && (
        <div className="parsed-parameters">
          <h3 className="parsed-title">Detected Parameters:</h3>
          <div className="parsed-tags">
            {Object.entries(results.parsed).map(([key, value]) => (
              <span key={key} className="parsed-tag">
                <span className="parsed-key">{formatParsedKey(key)}:</span>
                <span className="parsed-value">{formatParsedValue(value)}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {compareCount >= 2 && (
        <div className="compare-banner">
          <span>{compareCount} recipes selected for comparison</span>
          <button className="btn btn-primary btn-small" onClick={onOpenCompare}>
            Compare Now
          </button>
        </div>
      )}

      <div className="recipes-list">
        {results.recommendations && results.recommendations.length > 0 ? (
          results.recommendations.map((item, index) => (
            <RecipeCard
              key={item.recipe.id}
              recipe={item.recipe}
              score={item.score}
              explanation={item.explanation}
              rank={index + 1}
              onToggleFavorite={onToggleFavorite}
              isFavorite={isFavorite}
              onToggleCompare={onToggleCompare}
              isInCompareList={isInCompareList}
            />
          ))
        ) : (
          <div className="no-results">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <h3>No matching recipes found</h3>
            <p>Try adjusting your search criteria for better results.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ResultsPage
