import RecipeCard from './RecipeCard'

function FavoritesPage({
  favorites,
  onBack,
  onRemoveFavorite,
  onToggleCompare,
  isInCompareList,
  compareCount,
  onOpenCompare
}) {
  return (
    <div className="favorites-page">
      <div className="page-header">
        <button className="btn btn-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h2 className="page-title">
          <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          Saved Recipes
        </h2>
      </div>

      {compareCount >= 2 && (
        <div className="compare-banner">
          <span>{compareCount} recipes selected for comparison</span>
          <button className="btn btn-primary btn-small" onClick={onOpenCompare}>
            Compare Now
          </button>
        </div>
      )}

      {favorites.length > 0 ? (
        <div className="recipes-list">
          {favorites.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onToggleFavorite={onRemoveFavorite}
              isFavorite={() => true}
              onToggleCompare={onToggleCompare}
              isInCompareList={isInCompareList}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <h3>No saved recipes yet</h3>
          <p>Search for recipes and click the heart icon to save your favorites.</p>
          <button className="btn btn-primary" onClick={onBack}>
            Find Recipes
          </button>
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
