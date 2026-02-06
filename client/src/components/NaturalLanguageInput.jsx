import { useState } from 'react'

const examplePrompts = [
  "Moody night street photography",
  "Golden hour portraits",
  "Vintage film look"
]

function NaturalLanguageInput({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!prompt.trim()) {
      return
    }
    onSubmit(prompt.trim())
  }

  const handleExampleClick = (example) => {
    setPrompt(example)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="natural-language-input">
      <form onSubmit={handleSubmit}>
        <div className="prompt-container">
          <textarea
            className="prompt-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your shoot... e.g., 'sunset portraits on the beach'"
            rows={2}
          />
          <button
            type="submit"
            className="prompt-submit-btn"
            disabled={loading || !prompt.trim()}
          >
            {loading ? (
              <span className="spinner"></span>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            )}
          </button>
        </div>
      </form>

      <div className="examples-inline">
        <span className="examples-label">Try:</span>
        {examplePrompts.map((example, index) => (
          <button
            key={index}
            className="example-chip"
            onClick={() => handleExampleClick(example)}
            disabled={loading}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export default NaturalLanguageInput
