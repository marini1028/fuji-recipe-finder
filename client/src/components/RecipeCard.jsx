function RecipeCard({
  recipe,
  score,
  explanation,
  rank,
  onToggleFavorite,
  isFavorite,
  onToggleCompare,
  isInCompareList,
  showActions = true
}) {
  const formatValue = (value) => {
    if (value === 0) return '0'
    return value > 0 ? `+${value}` : `${value}`
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'score-high'
    if (score >= 40) return 'score-medium'
    return 'score-low'
  }

  const favorite = isFavorite ? isFavorite(recipe.id) : false
  const inCompare = isInCompareList ? isInCompareList(recipe.id) : false

  return (
    <div className={`recipe-card ${rank === 1 ? 'top-pick' : ''} ${inCompare ? 'in-compare' : ''}`}>
      {rank === 1 && <div className="top-pick-badge">Top Pick</div>}

      <div className="recipe-header">
        <div className="recipe-title-section">
          <h3 className="recipe-name">{recipe.name}</h3>
          <span className="film-simulation">{recipe.filmSimulation}</span>
        </div>
        {score !== undefined && (
          <div className={`match-score ${getScoreColor(score)}`}>
            <span className="score-value">{score}%</span>
            <span className="score-label">match</span>
          </div>
        )}
      </div>

      <p className="recipe-description">{recipe.description}</p>

      {recipe.sampleImages && recipe.sampleImages.length > 0 && (
        <div className="sample-images">
          {recipe.sampleImages.map((imageUrl, index) => (
            <div key={index} className="sample-image">
              <img src={imageUrl} alt={`${recipe.name} sample ${index + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {explanation && (
        <div className="recipe-explanation">
          <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          {explanation}
        </div>
      )}

      {showActions && (
        <div className="recipe-actions">
          {onToggleFavorite && (
            <button
              className={`action-btn favorite-btn ${favorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(recipe)}
              title={favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <svg viewBox="0 0 24 24" fill={favorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favorite ? 'Saved' : 'Save'}
            </button>
          )}

          {onToggleCompare && (
            <button
              className={`action-btn compare-btn ${inCompare ? 'active' : ''}`}
              onClick={() => onToggleCompare(recipe)}
              title={inCompare ? 'Remove from compare' : 'Add to compare'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
              {inCompare ? 'Comparing' : 'Compare'}
            </button>
          )}
        </div>
      )}

      <div className="recipe-settings">
        <h4 className="settings-title">Camera Settings</h4>

        <div className="settings-grid">
          <div className="setting-group">
            <span className="setting-label">White Balance</span>
            <span className="setting-value">{recipe.settings.whiteBalance}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">WB Shift</span>
            <span className="setting-value">
              R: {formatValue(recipe.settings.whiteBalanceShift.red)}, B: {formatValue(recipe.settings.whiteBalanceShift.blue)}
            </span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Dynamic Range</span>
            <span className="setting-value">{recipe.settings.dynamicRange}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Highlight</span>
            <span className="setting-value">{formatValue(recipe.settings.highlight)}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Shadow</span>
            <span className="setting-value">{formatValue(recipe.settings.shadow)}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Color</span>
            <span className="setting-value">{formatValue(recipe.settings.color)}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Sharpness</span>
            <span className="setting-value">{formatValue(recipe.settings.sharpness)}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Noise Reduction</span>
            <span className="setting-value">{formatValue(recipe.settings.noiseReduction)}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Grain Effect</span>
            <span className="setting-value">
              {recipe.settings.grainEffect}
              {recipe.settings.grainEffect !== 'Off' && ` (${recipe.settings.grainSize})`}
            </span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Color Chrome</span>
            <span className="setting-value">{recipe.settings.colorChromeEffect}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Color Chrome FX Blue</span>
            <span className="setting-value">{recipe.settings.colorChromeFxBlue}</span>
          </div>

          <div className="setting-group">
            <span className="setting-label">Clarity</span>
            <span className="setting-value">{formatValue(recipe.settings.clarity)}</span>
          </div>

          <div className="setting-group full-width">
            <span className="setting-label">Exposure Compensation</span>
            <span className="setting-value">{recipe.settings.exposureCompensation} EV</span>
          </div>
        </div>
      </div>

      {recipe.tags && recipe.tags.length > 0 && (
        <div className="recipe-tags">
          {recipe.tags.slice(0, 6).map((tag, index) => (
            <span key={index} className="tag">{tag.replace('_', ' ')}</span>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipeCard
