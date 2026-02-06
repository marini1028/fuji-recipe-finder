import { useState } from 'react'

const formOptions = {
  lighting: [
    { value: '', label: 'Select lighting...' },
    { value: 'bright_sunlight', label: 'Bright Sunlight' },
    { value: 'golden_hour', label: 'Golden Hour' },
    { value: 'blue_hour', label: 'Blue Hour' },
    { value: 'overcast', label: 'Overcast / Cloudy' },
    { value: 'indoor', label: 'Indoor' },
    { value: 'night', label: 'Night' },
    { value: 'mixed', label: 'Mixed Lighting' }
  ],
  subject: [
    { value: '', label: 'Select subject...' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'street', label: 'Street Photography' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'architecture', label: 'Architecture' },
    { value: 'nature', label: 'Nature / Wildlife' },
    { value: 'food', label: 'Food' },
    { value: 'travel', label: 'Travel / Documentary' },
    { value: 'event', label: 'Event / Party' }
  ],
  mood: [
    { value: '', label: 'Select mood...' },
    { value: 'cinematic', label: 'Cinematic' },
    { value: 'vintage', label: 'Vintage / Retro' },
    { value: 'modern', label: 'Modern / Clean' },
    { value: 'dreamy', label: 'Dreamy / Soft' },
    { value: 'moody', label: 'Moody / Dark' },
    { value: 'natural', label: 'Natural / Realistic' },
    { value: 'dramatic', label: 'Dramatic / Bold' },
    { value: 'minimal', label: 'Minimal' }
  ],
  colorPreference: [
    { value: '', label: 'Select color preference...' },
    { value: 'warm', label: 'Warm Tones' },
    { value: 'cool', label: 'Cool Tones' },
    { value: 'neutral', label: 'Neutral / Balanced' },
    { value: 'vibrant', label: 'Vibrant / Saturated' },
    { value: 'muted', label: 'Muted / Desaturated' },
    { value: 'bw', label: 'Black & White' },
    { value: 'teal_orange', label: 'Teal & Orange' }
  ],
  location: [
    { value: '', label: 'Select location...' },
    { value: 'city', label: 'City / Urban' },
    { value: 'nature', label: 'Nature / Outdoors' },
    { value: 'beach', label: 'Beach / Coastal' },
    { value: 'cafe', label: 'Cafe / Restaurant' },
    { value: 'studio', label: 'Studio' },
    { value: 'home', label: 'Home / Indoor' }
  ],
  season: [
    { value: '', label: 'Select season...' },
    { value: 'summer', label: 'Summer' },
    { value: 'autumn', label: 'Autumn / Fall' },
    { value: 'winter', label: 'Winter' },
    { value: 'spring', label: 'Spring' }
  ]
}

function StructuredForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    lighting: '',
    subject: '',
    mood: '',
    colorPreference: '',
    location: '',
    season: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Check if at least one field is filled
    const hasInput = Object.values(formData).some(v => v !== '')
    if (!hasInput) {
      alert('Please fill in at least one field')
      return
    }

    onSubmit(formData)
  }

  const handleClear = () => {
    setFormData({
      lighting: '',
      subject: '',
      mood: '',
      colorPreference: '',
      location: '',
      season: ''
    })
  }

  return (
    <form className="structured-form" onSubmit={handleSubmit}>
      <p className="form-description">
        Tell us about your shooting conditions and preferences to get personalized recipe recommendations.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="lighting">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </span>
            Lighting
          </label>
          <select
            id="lighting"
            name="lighting"
            value={formData.lighting}
            onChange={handleChange}
            className={formData.lighting ? 'has-value' : ''}
          >
            {formOptions.lighting.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subject">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </span>
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className={formData.subject ? 'has-value' : ''}
          >
            {formOptions.subject.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="mood">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
              </svg>
            </span>
            Mood / Style
          </label>
          <select
            id="mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            className={formData.mood ? 'has-value' : ''}
          >
            {formOptions.mood.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="colorPreference">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="13.5" cy="6.5" r="2.5" />
                <circle cx="17.5" cy="10.5" r="2.5" />
                <circle cx="8.5" cy="7.5" r="2.5" />
                <circle cx="6.5" cy="12.5" r="2.5" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </span>
            Color Preference
          </label>
          <select
            id="colorPreference"
            name="colorPreference"
            value={formData.colorPreference}
            onChange={handleChange}
            className={formData.colorPreference ? 'has-value' : ''}
          >
            {formOptions.colorPreference.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="location">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            Location
          </label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className={formData.location ? 'has-value' : ''}
          >
            {formOptions.location.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="season">
            <span className="label-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v20M17 7l-5 5-5-5M7 17l5-5 5 5M2 12h20M5 5l14 14M19 5L5 19" />
              </svg>
            </span>
            Season
          </label>
          <select
            id="season"
            name="season"
            value={formData.season}
            onChange={handleChange}
            className={formData.season ? 'has-value' : ''}
          >
            {formOptions.season.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Finding Recipes...
            </>
          ) : (
            'Get Recommendations'
          )}
        </button>
      </div>
    </form>
  )
}

export default StructuredForm
