import { useState, useEffect } from 'react'
import './App.css'

const menu = [
  { id: 'home', icon: '⌂', label: 'Home' },
  { id: 'upload', icon: '↥', label: 'Upload Leaf Image' },
  { id: 'result', icon: '◉', label: 'Detection Result' },
  { id: 'treatment', icon: '✚', label: 'Treatment & Recommendation' },
  { id: 'history', icon: '◷', label: 'History' },
  { id: 'dashboard', icon: '▥', label: 'Dashboard' },
  { id: 'about', icon: 'ⓘ', label: 'About / How It Works' },
  { id: 'team', icon: '♧', label: 'Team' },
]

function App() {
  const [page, setPage] = useState('home')
  const [leaf, setLeaf] = useState(null)
  const [preview, setPreview] = useState('')
  const [analysed, setAnalysed] = useState(false)

  // Release the preview URL when the component unmounts
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  const handleUpload = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      event.target.value = ''
      return
    }

    const maxSize = 10 * 1024 * 1024

    if (file.size > maxSize) {
      alert('Image size must be less than 10 MB.')
      event.target.value = ''
      return
    }

    const imageUrl = URL.createObjectURL(file)

    setLeaf(file)
    setPreview(imageUrl)
    setAnalysed(false)
  }

  const removeImage = () => {
    setLeaf(null)
    setPreview('')
    setAnalysed(false)
  }

  const startAnalysis = () => {
    if (!leaf) {
      alert('Please upload a leaf image first.')
      setPage('upload')
      return
    }

    setAnalysed(true)
    setPage('result')
  }

  const title =
    menu.find((item) => item.id === page)?.label || 'Home'

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🌿</div>
          <div>
            <h2>AgroScan</h2>
            <span>SMART FARMING AI</span>
          </div>
        </div>

        <div className="menu-caption">MAIN MENU</div>

        <nav className="side-menu">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`menu-item ${
                page === item.id ? 'active' : ''
              }`}
              onClick={() => setPage(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
              {page === item.id && (
                <span className="active-dot" />
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-icon">?</div>
          <div>
            <strong>Need help?</strong>
            <p>We're here for you.</p>
          </div>
        </div>

        <div className="profile-mini">
          <div className="avatar">👩‍🌾</div>
          <div>
            <strong>AgroScan User</strong>
            <span>Farmer Account</span>
          </div>
          <span className="dots">•••</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            Pages <span>/</span> <strong>{title}</strong>
          </div>

          <div className="topbar-right">
            <span className="status-pill">
              <span /> AI System Online
            </span>

            <button
              className="icon-button"
              title="Notifications"
            >
              ♧
            </button>

            <button
              className="icon-button"
              title="Settings"
              onClick={() => setPage('about')}
            >
              ⚙
            </button>

            <div className="top-avatar">👩‍🌾</div>
          </div>
        </header>

        {/* HOME PAGE */}
        {page === 'home' && (
          <section className="page-content">
            <div className="welcome-row">
              <div>
                <p className="eyebrow">
                  YOUR FARMING COMPANION
                </p>
                <h1>
                  Good day, Farmer! <span>🌱</span>
                </h1>
                <p className="subheading">
                  Let's keep your crops healthy and thriving.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => setPage('upload')}
              >
                ＋ Scan a Leaf
              </button>
            </div>

            <div className="hero-card">
              <div className="hero-copy">
                <span className="hero-tag">
                  ✦ AI-POWERED CROP CARE
                </span>

                <h2>
                  Healthy crops.
                  <br />
                  A healthier future.
                </h2>

                <p>
                  Identify crop diseases early and get smart
                  treatment recommendations to protect your
                  harvest.
                </p>

                <button
                  className="hero-button"
                  onClick={() => setPage('upload')}
                >
                  Start Detection <span>→</span>
                </button>

                <div className="hero-note">
                  <span>✓</span> Quick · Simple · Farmer friendly
                </div>
              </div>

              <div className="hero-art">
                <div className="sun" />

                <div className="plant-pot">
                  <div className="stem" />
                  <div className="leaf-shape leaf-a" />
                  <div className="leaf-shape leaf-b" />
                  <div className="leaf-shape leaf-c" />
                  <div className="leaf-shape leaf-d" />
                  <div className="pot" />
                </div>

                <div className="floating-card">
                  <span>✦</span>
                  <div>
                    <strong>Smart Analysis</strong>
                    <small>AI crop health insights</small>
                  </div>
                </div>

                <div className="floating-badge">
                  🌿 Healthy growth
                </div>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <h2>Overview</h2>
                <p>Your crop health at a glance</p>
              </div>
              <span className="muted-label">Sample dashboard data</span>
            </div>

            <div className="stats-grid">
              <StatCard
                icon="⌁"
                color="mint"
                label="Total Scans"
                value="128"
                note="Sample data"
              />
              <StatCard
                icon="♡"
                color="lime"
                label="Healthy Crops"
                value="86"
                note="Sample data"
              />
              <StatCard
                icon="⚠"
                color="peach"
                label="Diseases Detected"
                value="42"
                note="Sample data"
              />
              <StatCard
                icon="✚"
                color="lavender"
                label="Treatments Given"
                value="36"
                note="Sample data"
              />
            </div>

            <div className="bottom-grid">
              <div className="panel recent-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Recent Activity</h3>
                    <p>Your latest crop scans</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setPage('history')}
                  >
                    View history →
                  </button>
                </div>

                <Activity
                  icon="🍃"
                  name="Tomato leaf scan"
                  date="Sample activity"
                  tag="Healthy"
                  good
                />

                <Activity
                  icon="🌿"
                  name="Rice leaf scan"
                  date="Sample activity"
                  tag="Leaf Blast"
                />

                <Activity
                  icon="🍃"
                  name="Chilli leaf scan"
                  date="Sample activity"
                  tag="Leaf Spot"
                />
              </div>

              <div className="panel tip-panel">
                <span className="tip-icon">☀</span>
                <span className="hero-tag">FARMER'S TIP</span>
                <h3>A little care goes a long way.</h3>
                <p>
                  Inspect leaves regularly and look for unusual
                  spots, discoloration, or wilting. Early
                  detection helps protect your harvest.
                </p>

                <button
                  className="text-button"
                  onClick={() => setPage('about')}
                >
                  Learn how it works →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* UPLOAD PAGE */}
        {page === 'upload' && (
          <section className="page-content">
            <PageHeading
              eyebrow="CROP HEALTH ANALYSIS"
              title="Upload Leaf Image"
              description="Upload a clear photo of your crop leaf to get started."
            />

            <div className="upload-layout">
              <div className="panel upload-panel">
                <div className="upload-zone">
                  {preview ? (
                    <img
                      className="leaf-preview"
                      src={preview}
                      alt="Selected crop leaf"
                    />
                  ) : (
                    <div className="upload-illustration">
                      🌿<span>＋</span>
                    </div>
                  )}

                  <h3>
                    {leaf
                      ? leaf.name
                      : 'Drop your leaf image here'}
                  </h3>

                  <p>
                    Choose a clear, well-lit image of a single leaf.
                  </p>

                  <label className="primary-button file-button">
                    Browse Image
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleUpload}
                    />
                  </label>

                  <span className="file-note">
                    JPG, PNG or WEBP · Max 10 MB
                  </span>
                </div>

                {leaf && (
                  <div className="selected-file">
                    <span>✓</span>
                    <span className="selected-file-name">
                      {leaf.name}
                    </span>
                    <button onClick={removeImage}>
                      Remove
                    </button>
                  </div>
                )}

                <button
                  className="primary-button full-button"
                  onClick={startAnalysis}
                >
                  Analyze Leaf <span>→</span>
                </button>

                <p className="privacy-note">
                  🔒 Your uploaded image is used in this demo
                  interface.
                </p>
              </div>

              <div className="panel guide-panel">
                <h3>📷 Tips for a better scan</h3>

                <GuideItem
                  number="01"
                  title="Use natural light"
                  text="Take the photo in good daylight."
                />

                <GuideItem
                  number="02"
                  title="Focus on one leaf"
                  text="Make sure the leaf is clearly visible."
                />

                <GuideItem
                  number="03"
                  title="Avoid blurry images"
                  text="Keep your camera steady while capturing."
                />

                <GuideItem
                  number="04"
                  title="Show affected areas"
                  text="Include spots or discoloration in the photo."
                />
              </div>
            </div>
          </section>
        )}

        {/* DETECTION RESULT PAGE */}
        {page === 'result' && (
          <section className="page-content">
            <PageHeading
              eyebrow="ANALYSIS SUMMARY"
              title="Detection Result"
              description="Review the crop health assessment."
            />

            {!leaf ? (
              <EmptyState
                text="No leaf image selected yet."
                button="Upload a leaf image"
                onClick={() => setPage('upload')}
              />
            ) : (
              <div className="result-layout">
                <div className="panel result-image-panel">
                  <h3>Uploaded Leaf</h3>

                  <img
                    className="result-image"
                    src={preview}
                    alt="Uploaded crop leaf"
                  />

                  <div className="image-caption">
                    <span className="online-dot" />
                    Image uploaded successfully
                  </div>
                </div>

                <div className="panel result-summary">
                  <span className="result-label">
                    {analysed ? 'DEMO ANALYSIS' : 'IMAGE READY'}
                  </span>

                  <h2>
                    {analysed
                      ? 'Demo result — not AI verified'
                      : 'Ready for analysis'}
                  </h2>

                  <p>
                    {analysed
                      ? 'This frontend demonstrates the result screen. A real disease prediction requires connection to your project model or backend.'
                      : 'Your image is ready. Run the demo analysis to view this result layout.'}
                  </p>

                  <div className="result-metric">
                    <span>Prediction status</span>
                    <strong>
                      {analysed ? 'Demo only' : 'Pending'}
                    </strong>
                  </div>

                  <div className="result-metric">
                    <span>Model confidence</span>
                    <strong>Not available</strong>
                  </div>

                  <div className="notice-box">
                    ⓘ This UI does not make a real crop disease
                    diagnosis yet.
                  </div>

                  <button
                    className="primary-button full-button"
                    onClick={() => setPage('treatment')}
                  >
                    View Treatment Guide →
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* TREATMENT PAGE */}
        {page === 'treatment' && (
          <section className="page-content">
            <PageHeading
              eyebrow="CROP CARE GUIDE"
              title="Treatment & Recommendation"
              description="Explore general steps to help protect your crops."
            />

            <div className="notice-box wide-notice">
              ⓘ Recommendations below are general educational
              guidance, not a diagnosis of your uploaded image.
            </div>

            <div className="treatment-grid">
              <div className="panel treatment-main">
                <span className="treatment-icon">🌱</span>
                <span className="result-label">CROP CARE</span>

                <h2>Protect your plants with timely care</h2>

                <p>
                  Start by checking affected leaves and getting
                  advice from a local agricultural expert if
                  symptoms spread.
                </p>

                <h3>Recommended next steps</h3>

                <GuideItem
                  number="01"
                  title="Inspect the crop"
                  text="Check nearby plants for similar symptoms."
                />

                <GuideItem
                  number="02"
                  title="Remove severely affected leaves"
                  text="Use clean tools and dispose of plant material responsibly."
                />

                <GuideItem
                  number="03"
                  title="Keep foliage dry where practical"
                  text="Water near the soil and follow local crop guidance."
                />

                <GuideItem
                  number="04"
                  title="Seek local expert advice"
                  text="Confirm the cause before applying any treatment."
                />
              </div>

              <div className="panel prevention-panel">
                <h3>🌿 Prevention tips</h3>

                <Activity
                  icon="💧"
                  name="Water thoughtfully"
                  date="Avoid excess moisture on leaves"
                  good
                />

                <Activity
                  icon="🌞"
                  name="Check sunlight"
                  date="Follow crop-specific growing needs"
                  good
                />

                <Activity
                  icon="🧤"
                  name="Clean tools"
                  date="Sanitize tools between plants"
                  good
                />

                <Activity
                  icon="🔎"
                  name="Monitor regularly"
                  date="Look for early changes"
                  good
                />
              </div>
            </div>
          </section>
        )}

        {/* HISTORY PAGE */}
        {page === 'history' && (
          <section className="page-content">
            <PageHeading
              eyebrow="YOUR ACTIVITY"
              title="Scan History"
              description="Review the image selected during this session."
            />

            <div className="panel history-panel">
              <div className="panel-heading">
                <div>
                  <h3>Recent scans</h3>
                  <p>History for this demo session</p>
                </div>

                <span className="count-pill">
                  {leaf ? '1 image selected' : '0 uploaded images'}
                </span>
              </div>

              {leaf ? (
                <div className="history-row">
                  <img src={preview} alt="Scan history" />

                  <div className="history-info">
                    <strong>{leaf.name}</strong>
                    <span>Uploaded in this session</span>
                  </div>

                  <span className="history-tag">
                    Pending model
                  </span>

                  <button
                    className="outline-button"
                    onClick={() => setPage('result')}
                  >
                    View
                  </button>
                </div>
              ) : (
                <EmptyState
                  text="Your uploaded images will appear here."
                  button="Upload your first leaf"
                  onClick={() => setPage('upload')}
                />
              )}
            </div>
          </section>
        )}

        {/* DASHBOARD PAGE */}
        {page === 'dashboard' && (
          <section className="page-content">
            <PageHeading
              eyebrow="INSIGHTS & OVERVIEW"
              title="Dashboard"
              description="A visual summary of crop scanning activity."
            />

            <div className="stats-grid">
              <StatCard
                icon="⌁"
                color="mint"
                label="Total Scans"
                value="128"
                note="Sample display data"
              />

              <StatCard
                icon="♡"
                color="lime"
                label="Healthy Crops"
                value="86"
                note="Sample display data"
              />

              <StatCard
                icon="⚠"
                color="peach"
                label="Disease Alerts"
                value="42"
                note="Sample display data"
              />

              <StatCard
                icon="✚"
                color="lavender"
                label="Recommendations"
                value="36"
                note="Sample display data"
              />
            </div>

            <div className="dashboard-grid">
              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Weekly Scan Activity</h3>
                    <p>Illustrative sample data</p>
                  </div>

                  <span className="count-pill">This week</span>
                </div>

                <div className="chart">
                  {[
                    ['Mon', 35],
                    ['Tue', 55],
                    ['Wed', 42],
                    ['Thu', 78],
                    ['Fri', 60],
                    ['Sat', 88],
                    ['Sun', 48],
                  ].map(([day, height]) => (
                    <div className="chart-column" key={day}>
                      <div className="bar-track">
                        <div
                          className="bar"
                          style={{ height: `${height}%` }}
                        />
                      </div>
                      <span>{day}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel health-panel">
                <h3>Crop Health Overview</h3>

                <div className="donut">
                  <div>
                    <strong>67%</strong>
                    <span>Healthy</span>
                  </div>
                </div>

                <div className="legend">
                  <span>
                    <i className="legend-green" />
                    Healthy <b>86</b>
                  </span>

                  <span>
                    <i className="legend-orange" />
                    Needs review <b>42</b>
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ABOUT PAGE */}
        {page === 'about' && (
          <section className="page-content">
            <PageHeading
              eyebrow="ABOUT AGROSCAN"
              title="How It Works"
              description="A simple workflow for crop image screening."
            />

            <div className="about-hero">
              <div>
                <span className="hero-tag">
                  FROM LEAF TO INSIGHT
                </span>

                <h2>
                  Technology supporting
                  <br />
                  healthier farming.
                </h2>

                <p>
                  AgroScan is a crop health screening interface
                  concept designed to help farmers organize leaf
                  images, review results, and learn about crop care.
                </p>
              </div>

              <div className="about-emoji">🌾🌿</div>
            </div>

            <div className="steps-grid">
              <StepCard
                number="01"
                icon="📷"
                title="Upload a leaf"
                text="Choose a clear photo from your device."
              />

              <StepCard
                number="02"
                icon="🤖"
                title="AI analysis"
                text="A connected model can evaluate image patterns."
              />

              <StepCard
                number="03"
                icon="🔎"
                title="Review results"
                text="Check the prediction and confidence when available."
              />

              <StepCard
                number="04"
                icon="🌱"
                title="Explore care"
                text="Review guidance and consult local experts."
              />
            </div>

            <div className="panel about-note">
              <h3>Project status</h3>
              <p>
                This frontend is a UI prototype. Real disease
                prediction, saved history, and personalized
                recommendations require integration with the
                project backend and model.
              </p>
            </div>
          </section>
        )}

        {/* TEAM PAGE */}
        {page === 'team' && (
          <section className="page-content">
            <PageHeading
              eyebrow="THE PEOPLE BEHIND THE PROJECT"
              title="Meet Our Team"
              description="Working together for smarter crop care."
            />

            <div className="team-banner">
              <span>🌿</span>
              <div>
                <h2>Growing better solutions, together.</h2>
                <p>AgroScan · AI-Based Crop Disease Detection</p>
              </div>
            </div>

            <div className="team-grid">
              {[
                {
                  name: 'Priya',
                  role: 'Project Team Member',
                  symbol: 'P',
                },
                {
                  name: 'Blessy',
                  role: 'Project Team Member',
                  symbol: 'B',
                },
                {
                  name: 'Mukila',
                  role: 'Project Team Member',
                  symbol: 'M',
                },
                {
                  name: 'Lemitha',
                  role: 'Project Team Member',
                  symbol: 'L',
                },
              ].map((member) => (
                <div
                  className="panel member-card"
                  key={member.name}
                >
                  <div className="member-avatar">
                    {member.symbol}
                  </div>

                  <h3>{member.name}</h3>
                  <p>{member.role}</p>

                  <span className="member-badge">
                    AgroScan Team
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="footer">
          <span>© 2026 AgroScan · Smart Crop Care</span>
          <span>
            Built for healthier harvests <b>♥</b>
          </span>
        </footer>
      </main>
    </div>
  )
}

function PageHeading({ eyebrow, title, description }) {
  return (
    <div className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="subheading">{description}</p>
    </div>
  )
}

function StatCard({ icon, color, label, value, note }) {
  return (
    <div className="panel stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  )
}

function Activity({ icon, name, date, tag, good = false }) {
  return (
    <div className="activity-row">
      <div className="activity-icon">{icon}</div>

      <div className="activity-text">
        <strong>{name}</strong>
        <span>{date}</span>
      </div>

      {tag && (
        <span className={`activity-tag ${good ? 'good' : ''}`}>
          {tag}
        </span>
      )}
    </div>
  )
}

function GuideItem({ number, title, text }) {
  return (
    <div className="guide-item">
      <span className="guide-number">{number}</span>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  )
}

function EmptyState({ text, button, onClick }) {
  return (
    <div className="empty-state">
      <span>🌿</span>
      <h3>Nothing here yet</h3>
      <p>{text}</p>
      <button className="primary-button" onClick={onClick}>
        {button}
      </button>
    </div>
  )
}

function StepCard({ number, icon, title, text }) {
  return (
    <div className="panel step-card">
      <span className="step-number">{number}</span>
      <div className="step-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  )
}

export default App