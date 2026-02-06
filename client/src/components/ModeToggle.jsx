function ModeToggle({ mode, onModeChange }) {
  return (
    <div className="mode-toggle">
      <button
        className={`toggle-btn ${mode === 'form' ? 'active' : ''}`}
        onClick={() => onModeChange('form')}
      >
        <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 13h6M9 17h4" />
        </svg>
        Structured Form
      </button>
      <button
        className={`toggle-btn ${mode === 'prompt' ? 'active' : ''}`}
        onClick={() => onModeChange('prompt')}
      >
        <svg className="toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Natural Language
      </button>
    </div>
  )
}

export default ModeToggle
