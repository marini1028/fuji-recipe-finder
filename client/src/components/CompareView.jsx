function CompareView({ recipes, onBack, onRemove, onClear, isFavorite, onToggleFavorite }) {
  const formatValue = (value) => {
    if (value === 0) return '0'
    return value > 0 ? `+${value}` : `${value}`
  }

  const settings = [
    { key: 'filmSimulation', label: 'Film Simulation', getValue: (r) => r.filmSimulation },
    { key: 'whiteBalance', label: 'White Balance', getValue: (r) => r.settings.whiteBalance },
    { key: 'wbShiftRed', label: 'WB Shift Red', getValue: (r) => formatValue(r.settings.whiteBalanceShift.red) },
    { key: 'wbShiftBlue', label: 'WB Shift Blue', getValue: (r) => formatValue(r.settings.whiteBalanceShift.blue) },
    { key: 'dynamicRange', label: 'Dynamic Range', getValue: (r) => r.settings.dynamicRange },
    { key: 'highlight', label: 'Highlight', getValue: (r) => formatValue(r.settings.highlight) },
    { key: 'shadow', label: 'Shadow', getValue: (r) => formatValue(r.settings.shadow) },
    { key: 'color', label: 'Color', getValue: (r) => formatValue(r.settings.color) },
    { key: 'sharpness', label: 'Sharpness', getValue: (r) => formatValue(r.settings.sharpness) },
    { key: 'noiseReduction', label: 'Noise Reduction', getValue: (r) => formatValue(r.settings.noiseReduction) },
    { key: 'grainEffect', label: 'Grain Effect', getValue: (r) => r.settings.grainEffect },
    { key: 'grainSize', label: 'Grain Size', getValue: (r) => r.settings.grainSize },
    { key: 'colorChromeEffect', label: 'Color Chrome', getValue: (r) => r.settings.colorChromeEffect },
    { key: 'colorChromeFxBlue', label: 'Color Chrome FX Blue', getValue: (r) => r.settings.colorChromeFxBlue },
    { key: 'clarity', label: 'Clarity', getValue: (r) => formatValue(r.settings.clarity) },
    { key: 'exposureCompensation', label: 'Exposure Comp.', getValue: (r) => r.settings.exposureCompensation }
  ]

  // Check if values differ across recipes for highlighting
  const valuesDiffer = (settingKey, getValue) => {
    if (recipes.length < 2) return false
    const values = recipes.map(r => getValue(r))
    return !values.every(v => v === values[0])
  }

  if (recipes.length === 0) {
    return (
      <div className="compare-view">
        <div className="page-header">
          <button className="btn btn-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h2 className="page-title">Compare Recipes</h2>
        </div>
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          <h3>No recipes to compare</h3>
          <p>Select at least 2 recipes to compare their settings side by side.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="compare-view">
      <div className="page-header">
        <button className="btn btn-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="page-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Compare Recipes
        </h2>
        {recipes.length > 0 && (
          <button className="btn btn-secondary btn-small" onClick={onClear}>
            Clear All
          </button>
        )}
      </div>

      <div className="compare-table-container">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="setting-column">Setting</th>
              {recipes.map(recipe => (
                <th key={recipe.id} className="recipe-column">
                  <div className="compare-recipe-header">
                    <span className="compare-recipe-name">{recipe.name}</span>
                    <div className="compare-recipe-actions">
                      <button
                        className={`icon-btn ${isFavorite(recipe.id) ? 'active' : ''}`}
                        onClick={() => onToggleFavorite(recipe)}
                        title={isFavorite(recipe.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg viewBox="0 0 24 24" fill={isFavorite(recipe.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                      <button
                        className="icon-btn remove"
                        onClick={() => onRemove(recipe)}
                        title="Remove from comparison"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {settings.map(setting => {
              const differs = valuesDiffer(setting.key, setting.getValue)
              return (
                <tr key={setting.key} className={differs ? 'differs' : ''}>
                  <td className="setting-label">{setting.label}</td>
                  {recipes.map(recipe => (
                    <td key={recipe.id} className="setting-value">
                      {setting.getValue(recipe)}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="compare-descriptions">
        <h3>Descriptions</h3>
        <div className="descriptions-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="description-card">
              <h4>{recipe.name}</h4>
              <p>{recipe.description}</p>
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="recipe-tags">
                  {recipe.tags.slice(0, 6).map((tag, index) => (
                    <span key={index} className="tag">{tag.replace('_', ' ')}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CompareView
