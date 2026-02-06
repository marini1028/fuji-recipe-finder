function Header({ onShowFavorites, onShowSearch, favoritesCount, currentView }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-top">
          <div className="logo-section" onClick={onShowSearch} style={{ cursor: 'pointer' }}>
            <div className="logo">
              <svg className="logo-icon" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="10" y="20" width="80" height="50" rx="5" />
                <circle cx="50" cy="45" r="18" />
                <circle cx="50" cy="45" r="11" />
                <rect x="15" y="10" width="20" height="12" rx="2" />
                <circle cx="78" cy="28" r="4" />
              </svg>
              <h1>Fuji Recipe Finder</h1>
            </div>
            <p className="tagline">Find the perfect film simulation recipe for your shoot</p>
          </div>

          <button
            className={`favorites-btn ${currentView === 'favorites' ? 'active' : ''}`}
            onClick={onShowFavorites}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span className="favorites-text">Favorites</span>
            {favoritesCount > 0 && (
              <span className="favorites-badge">{favoritesCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
