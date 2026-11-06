
import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://127.0.0.1:8000'

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

function formatScan(item, preview = '') {
  return {
    id: item.id,
    name: item.image_name,
    preview,
    date: item.created_at,
    result: {
      plant: item.plant_name,
      disease: item.disease_name,
      confidence: item.confidence,
    },
  }
}

// Disease-wise treatment recommendations
function getTreatmentGuide(scanResult) {
  if (!scanResult) {
    return {
      title: 'Upload a leaf to get recommendations',
      description: 'Analyze a crop leaf image first. Treatment guidance will be displayed based on the AI prediction.',
      steps: [
        ['01', 'Upload a leaf image', 'Choose a clear image of the affected crop leaf.'],
        ['02', 'Run AI detection', 'Allow the AI model to analyze the uploaded image.'],
        ['03', 'View recommendations', 'Open this page again to see crop-specific guidance.'],
      ],
      tips: [
        'Use clear leaf images',
        'Inspect crops regularly',
        'Keep farming tools clean',
        'Monitor plant health',
      ],
    }
  }

  const disease = String(scanResult.disease || '')
    .toLowerCase()
    .replaceAll('_', ' ')
    .trim()

  const plant = scanResult.plant || 'your crop'

  const guides = {
    healthy: {
      title: `${plant} - Healthy Crop Care`,
      description: `The AI prediction indicates a healthy ${plant} leaf. Continue regular crop care and monitor the plant.`,
      steps: [
        ['01', 'Continue regular watering', 'Water according to the crop and soil moisture needs.'],
        ['02', 'Maintain soil health', 'Use suitable compost and maintain soil nutrients.'],
        ['03', 'Inspect leaves regularly', 'Check for unusual spots, discoloration, or insects.'],
        ['04', 'Maintain crop hygiene', 'Remove dead plant material and keep the growing area clean.'],
      ],
      tips: [
        'Water according to crop needs',
        'Provide suitable sunlight',
        'Maintain healthy soil',
        'Monitor new leaf growth',
      ],
    },

    'apple scab': {
      title: 'Apple Scab - Treatment Guide',
      description: `The AI prediction indicates possible Apple Scab in your ${plant} leaf. Look for dark or olive-coloured spots.`,
      steps: [
        ['01', 'Inspect affected leaves', 'Check leaves for dark, olive-coloured spots.'],
        ['02', 'Remove fallen leaves', 'Collect fallen infected leaves and dispose of them responsibly.'],
        ['03', 'Improve air circulation', 'Avoid overcrowding and prune appropriately.'],
        ['04', 'Get expert advice', 'Ask an agricultural expert to confirm the disease and suggest treatment.'],
      ],
      tips: [
        'Remove fallen infected leaves',
        'Avoid overcrowding plants',
        'Keep the growing area clean',
        'Inspect leaves after rainfall',
      ],
    },

    'powdery mildew': {
      title: 'Powdery Mildew - Treatment Guide',
      description: `The AI prediction indicates possible Powdery Mildew in your ${plant} leaf. It may appear as a white powder-like coating.`,
      steps: [
        ['01', 'Check affected areas', 'Inspect both sides of leaves for white powdery patches.'],
        ['02', 'Remove affected parts', 'Remove severely affected leaves when appropriate using clean tools.'],
        ['03', 'Improve air circulation', 'Provide enough space between plants.'],
        ['04', 'Consult an expert', 'Confirm the disease before choosing a treatment.'],
      ],
      tips: [
        'Check for white powdery patches',
        'Provide proper plant spacing',
        'Avoid excessive shade',
        'Clean tools after use',
      ],
    },

    rust: {
      title: `${plant} - Rust Disease Guide`,
      description: `The AI prediction indicates possible rust disease in your ${plant} leaf. Rust may appear as orange, yellow, or brown powdery spots.`,
      steps: [
        ['01', 'Inspect leaf surfaces', 'Look for orange or brown powdery spots.'],
        ['02', 'Remove badly affected leaves', 'Remove severely affected leaves when appropriate.'],
        ['03', 'Avoid wet foliage', 'Water near the soil instead of wetting leaves.'],
        ['04', 'Seek expert advice', 'Confirm the disease and suitable control measures with an expert.'],
      ],
      tips: [
        'Check leaves for rust-coloured spots',
        'Avoid wetting foliage',
        'Maintain plant spacing',
        'Remove fallen infected leaves',
      ],
    },

    blight: {
      title: `${plant} - Blight Disease Guide`,
      description: `The AI prediction indicates possible blight in your ${plant} leaf. Watch for spreading brown or dark damaged areas.`,
      steps: [
        ['01', 'Identify damaged areas', 'Check leaves for brown or black patches.'],
        ['02', 'Remove affected material', 'Remove severely damaged plant parts when appropriate.'],
        ['03', 'Keep foliage dry', 'Avoid overhead watering where possible.'],
        ['04', 'Get disease confirmation', 'Consult an agricultural expert for suitable treatment.'],
      ],
      tips: [
        'Avoid overhead watering',
        'Remove fallen plant debris',
        'Check nearby plants',
        'Disinfect gardening tools',
      ],
    },

    'leaf spot': {
      title: `${plant} - Leaf Spot Guide`,
      description: `The AI prediction indicates possible leaf spot disease in your ${plant}. Look for distinct spots or lesions on leaves.`,
      steps: [
        ['01', 'Examine leaf spots', 'Observe the colour, size, and spread of the spots.'],
        ['02', 'Remove badly affected leaves', 'Remove severely affected leaves when appropriate.'],
        ['03', 'Improve plant spacing', 'Allow enough space for air movement.'],
        ['04', 'Consult an expert', 'Get the disease confirmed before applying treatment.'],
      ],
      tips: [
        'Inspect leaves for new spots',
        'Keep foliage as dry as practical',
        'Maintain proper plant spacing',
        'Clean tools regularly',
      ],
    },

    mosaic: {
      title: `${plant} - Mosaic Disease Guide`,
      description: `The AI prediction indicates possible mosaic disease in your ${plant}. Look for unusual leaf patterns, mottling, or distortion.`,
      steps: [
        ['01', 'Check leaf patterns', 'Look for yellow-green patches and unusual leaf shapes.'],
        ['02', 'Inspect nearby plants', 'Check other plants for similar symptoms.'],
        ['03', 'Check for insect activity', 'Observe plants for insects that may spread plant viruses.'],
        ['04', 'Seek expert confirmation', 'Ask an agricultural expert about the suspected viral disease.'],
      ],
      tips: [
        'Monitor unusual leaf patterns',
        'Check plants for insect activity',
        'Clean tools between plants',
        'Inspect nearby crops regularly',
      ],
    },

    rot: {
      title: `${plant} - Rot Disease Guide`,
      description: `The AI prediction indicates possible rot disease in your ${plant}. Check for soft, discoloured, or decaying plant tissue.`,
      steps: [
        ['01', 'Inspect damaged areas', 'Look for soft, dark, or decaying plant tissue.'],
        ['02', 'Check soil moisture', 'Avoid keeping the soil excessively wet.'],
        ['03', 'Improve drainage', 'Make sure excess water can drain away.'],
        ['04', 'Get expert advice', 'Confirm the cause of the rot with an agricultural expert.'],
      ],
      tips: [
        'Avoid waterlogging',
        'Maintain proper soil drainage',
        'Remove decaying plant material',
        'Monitor soil moisture',
      ],
    },
  }

  if (disease.includes('healthy')) return guides.healthy
  if (disease.includes('apple scab')) return guides['apple scab']
  if (disease.includes('powdery mildew')) return guides['powdery mildew']
  if (disease.includes('rust')) return guides.rust
  if (disease.includes('blight')) return guides.blight
  if (disease.includes('leaf spot') || disease.includes('spot')) return guides['leaf spot']
  if (disease.includes('mosaic')) return guides.mosaic
  if (disease.includes('rot')) return guides.rot

  return {
    title: `${disease.replace(/\b\w/g, (char) => char.toUpperCase())} - Treatment Guide`,
    description: `The AI prediction indicates possible ${disease} in your ${plant} leaf. Confirm the disease with an agricultural expert.`,
    steps: [
      ['01', 'Inspect affected leaves', 'Check the symptoms and observe whether they are spreading.'],
      ['02', 'Check nearby plants', 'Look for similar symptoms in surrounding crops.'],
      ['03', 'Maintain crop hygiene', 'Remove dead plant material and keep tools clean.'],
      ['04', 'Get expert advice', 'Ask an agricultural expert to confirm the disease and suitable treatment.'],
    ],
    tips: [
      'Monitor the affected leaves',
      'Inspect nearby crops',
      'Keep gardening tools clean',
      'Follow local agricultural advice',
    ],
  }
}

function App() {
  const [page, setPage] = useState('home')
  const [leaf, setLeaf] = useState(null)
  const [preview, setPreview] = useState('')
  const [analysed, setAnalysed] = useState(false)
  const [result, setResult] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [selectedScan, setSelectedScan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Load saved history from SQLite database when page opens
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetch(`${API}/history`)
        if (!response.ok) throw new Error('History loading failed')

        const data = await response.json()
        setScanHistory(data.map((item) => formatScan(item)))
      } catch (err) {
        console.error('History error:', err)
      }
    }

    loadHistory()
  }, [])

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
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

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10 MB.')
      event.target.value = ''
      return
    }

    setLeaf(file)
    setPreview(URL.createObjectURL(file))
    setAnalysed(false)
    setResult(null)
    setSelectedScan(null)
    setError('')
  }

  const removeImage = () => {
    setLeaf(null)
    setPreview('')
    setAnalysed(false)
    setResult(null)
    setSelectedScan(null)
    setError('')
  }

  const startAnalysis = async () => {
    if (!leaf) {
      alert('Please upload a leaf image first.')
      setPage('upload')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', leaf)

      const response = await fetch(`${API}/predict`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Prediction failed.')
      }

      setResult(data)
      setAnalysed(true)

      // Get latest saved records from database
      const historyResponse = await fetch(`${API}/history`)

      if (!historyResponse.ok) {
        throw new Error('Prediction completed, but history could not load.')
      }

      const historyData = await historyResponse.json()

      const scans = historyData.map((item, index) =>
        formatScan(item, index === 0 ? preview : '')
      )

      setScanHistory(scans)

      const latestScan = scans[0]
      setSelectedScan(latestScan || {
        id: Date.now(),
        name: leaf.name,
        preview,
        date: new Date().toLocaleString(),
        result: data,
      })

      setPage('result')
    } catch (err) {
      setError(
        err.message === 'Failed to fetch'
          ? 'Cannot connect to the backend. Please check that the API is running.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  const openScan = (scan) => {
    setSelectedScan(scan)
    setResult(scan.result)
    setPreview(scan.preview || '')
    setAnalysed(true)
    setPage('result')
  }

  const title = menu.find((item) => item.id === page)?.label || 'Home'

  const totalScans = scanHistory.length
  const healthyScans = scanHistory.filter((scan) =>
    scan.result.disease.toLowerCase().includes('healthy')
  ).length
  const diseaseAlerts = totalScans - healthyScans

  const displayScan = selectedScan
    ? selectedScan
    : result
      ? { name: leaf?.name || 'Uploaded leaf', preview, result }
      : null

  const treatmentGuide = getTreatmentGuide(displayScan?.result || result)

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
              className={`menu-item ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.label}</span>
              {page === item.id && <span className="active-dot" />}
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
            <button className="icon-button" title="Notifications">♧</button>
            <button className="icon-button" title="Settings" onClick={() => setPage('about')}>⚙</button>
            <div className="top-avatar">👩‍🌾</div>
          </div>
        </header>

        {page === 'home' && (
          <section className="page-content">
            <div className="welcome-row">
              <div>
                <p className="eyebrow">YOUR FARMING COMPANION</p>
                <h1>Good day, Farmer! <span>🌱</span></h1>
                <p className="subheading">Let's keep your crops healthy and thriving.</p>
              </div>
              <button className="primary-button" onClick={() => setPage('upload')}>＋ Scan a Leaf</button>
            </div>

            <div className="hero-card">
              <div className="hero-copy">
                <span className="hero-tag">✦ AI-POWERED CROP CARE</span>
                <h2>Healthy crops.<br />A healthier future.</h2>
                <p>Identify crop diseases early and get smart treatment recommendations to protect your harvest.</p>
                <button className="hero-button" onClick={() => setPage('upload')}>Start Detection <span>→</span></button>
                <div className="hero-note"><span>✓</span> Quick · Simple · Farmer friendly</div>
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
                  <div><strong>Smart Analysis</strong><small>AI crop health insights</small></div>
                </div>
                <div className="floating-badge">🌿 Healthy growth</div>
              </div>
            </div>

            <div className="section-heading">
              <div><h2>Overview</h2><p>Your saved crop scans at a glance</p></div>
              <span className="muted-label">Live database data</span>
            </div>

            <div className="stats-grid">
              <StatCard icon="⌁" color="mint" label="Total Scans" value={totalScans} note="Saved scans" />
              <StatCard icon="♡" color="lime" label="Healthy Crops" value={healthyScans} note="Healthy predictions" />
              <StatCard icon="⚠" color="peach" label="Diseases Detected" value={diseaseAlerts} note="Disease predictions" />
              <StatCard icon="✚" color="lavender" label="Treatments Given" value={diseaseAlerts} note="Scans needing review" />
            </div>

            <div className="bottom-grid">
              <div className="panel recent-panel">
                <div className="panel-heading">
                  <div><h3>Recent Activity</h3><p>Your latest crop scans</p></div>
                  <button className="text-button" onClick={() => setPage('history')}>View history →</button>
                </div>

                {scanHistory.length > 0 ? (
                  scanHistory.slice(0, 3).map((scan) => (
                    <Activity
                      key={scan.id}
                      icon="🌿"
                      name={scan.name}
                      date={scan.date}
                      tag={scan.result.disease.replaceAll('_', ' ')}
                    />
                  ))
                ) : (
                  <EmptyState
                    text="Your saved scans will appear here."
                    button="Upload a leaf"
                    onClick={() => setPage('upload')}
                  />
                )}
              </div>

              <div className="panel tip-panel">
                <span className="tip-icon">☀</span>
                <span className="hero-tag">FARMER'S TIP</span>
                <h3>A little care goes a long way.</h3>
                <p>Inspect leaves regularly and look for unusual spots, discoloration, or wilting. Early detection helps protect your harvest.</p>
                <button className="text-button" onClick={() => setPage('about')}>Learn how it works →</button>
              </div>
            </div>
          </section>
        )}

        {page === 'upload' && (
          <section className="page-content">
            <PageHeading eyebrow="CROP HEALTH ANALYSIS" title="Upload Leaf Image" description="Upload a clear photo of your crop leaf to get started." />

            <div className="upload-layout">
              <div className="panel upload-panel">
                <div className="upload-zone">
                  {preview ? (
                    <img className="leaf-preview" src={preview} alt="Selected crop leaf" />
                  ) : (
                    <div className="upload-illustration">🌿<span>＋</span></div>
                  )}
                  <h3>{leaf ? leaf.name : 'Drop your leaf image here'}</h3>
                  <p>Choose a clear, well-lit image of a single leaf.</p>
                  <label className="primary-button file-button">
                    Browse Image
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleUpload} />
                  </label>
                  <span className="file-note">JPG, PNG or WEBP · Max 10 MB</span>
                </div>

                {leaf && (
                  <div className="selected-file">
                    <span>✓</span>
                    <span className="selected-file-name">{leaf.name}</span>
                    <button onClick={removeImage}>Remove</button>
                  </div>
                )}

                <button className="primary-button full-button" onClick={startAnalysis} disabled={loading}>
                  {loading ? 'Analyzing...' : <>Analyze Leaf <span>→</span></>}
                </button>

                {error && <p className="error-message">{error}</p>}
                <p className="privacy-note">🔒 Your uploaded image is sent to the project API for analysis.</p>
              </div>

              <div className="panel guide-panel">
                <h3>📷 Tips for a better scan</h3>
                <GuideItem number="01" title="Use natural light" text="Take the photo in good daylight." />
                <GuideItem number="02" title="Focus on one leaf" text="Make sure the leaf is clearly visible." />
                <GuideItem number="03" title="Avoid blurry images" text="Keep your camera steady while capturing." />
                <GuideItem number="04" title="Show affected areas" text="Include spots or discoloration in the photo." />
              </div>
            </div>
          </section>
        )}

        {page === 'result' && (
          <section className="page-content">
            <PageHeading eyebrow="ANALYSIS SUMMARY" title="Detection Result" description="Review the crop health assessment." />

            {!displayScan ? (
              <EmptyState text="No scan selected yet." button="Upload a leaf image" onClick={() => setPage('upload')} />
            ) : (
              <div className="result-layout">
                <div className="panel result-image-panel">
                  <h3>Uploaded Leaf</h3>
                  {displayScan.preview ? (
                    <img className="result-image" src={displayScan.preview} alt="Uploaded crop leaf" />
                  ) : (
                    <div className="activity-icon">🌿</div>
                  )}
                  <div className="image-caption"><span className="online-dot" /> {displayScan.name}</div>
                </div>

                <div className="panel result-summary">
                  <span className="result-label">AI ANALYSIS COMPLETE</span>
                  <h2>
                    {displayScan.result.disease
                      .replaceAll('_', ' ')
                      .replace(displayScan.result.plant, '')
                      .trim()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </h2>
                  <p>
                    AI detected {displayScan.result.disease.replaceAll('_', ' ')} in your {displayScan.result.plant} leaf.
                  </p>
                  <div className="result-metric">
                    <span>Crop</span>
                    <strong>{displayScan.result.plant}</strong>
                  </div>
                  <div className="result-metric">
                    <span>Prediction status</span>
                    <strong>AI prediction completed</strong>
                  </div>
                  <div className="result-metric">
                    <span>Model confidence</span>
                    <strong>{(displayScan.result.confidence * 100).toFixed(2)}%</strong>
                  </div>
                  <div className="notice-box">ⓘ AI prediction based on the uploaded leaf image. Results may not always be accurate.</div>
                  <button className="primary-button full-button" onClick={() => setPage('treatment')}>View Treatment Guide →</button>
                </div>
              </div>
            )}
          </section>
        )}

        {page === 'treatment' && (
          <section className="page-content">
            <PageHeading
              eyebrow="PERSONALIZED CROP CARE"
              title="Treatment & Recommendation"
              description="Care guidance based on your selected AI prediction."
            />

            <div className="notice-box wide-notice">
              ⓘ AI recommendations are educational guidance. Confirm the disease with an agricultural expert before applying treatment.
            </div>

            <div className="treatment-grid">
              <div className="panel treatment-main">
                <span className="treatment-icon">🌱</span>
                <span className="result-label">AI-BASED CROP CARE</span>
                <h2 className="treatment-title">{treatmentGuide.title}</h2>
                <p>{treatmentGuide.description}</p>
                <h3>Recommended next steps</h3>

                {treatmentGuide.steps.map(([number, title, text]) => (
                  <GuideItem
                    key={number}
                    number={number}
                    title={title}
                    text={text}
                  />
                ))}
              </div>

              <div className="panel prevention-panel">
                <h3>🌿 Prevention tips</h3>

                {treatmentGuide.tips.map((tip, index) => (
                  <Activity
                    key={tip}
                    icon={['💧', '🌞', '🧤', '🔎'][index]}
                    name={tip}
                    date="Recommended crop care"
                    good
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {page === 'history' && (
          <section className="page-content">
            <PageHeading eyebrow="YOUR ACTIVITY" title="Scan History" description="Review all your saved crop scans." />

            <div className="panel history-panel">
              <div className="panel-heading">
                <div><h3>Recent scans</h3><p>History saved in database</p></div>
                <span className="count-pill">
                  {scanHistory.length} {scanHistory.length === 1 ? 'scan' : 'scans'}
                </span>
              </div>

              {scanHistory.length > 0 ? (
                scanHistory.map((scan) => (
                  <div className="history-row" key={scan.id}>
                    {scan.preview ? (
                      <img src={scan.preview} alt="Scan history" />
                    ) : (
                      <div className="activity-icon">🌿</div>
                    )}
                    <div className="history-info">
                      <strong>{scan.name}</strong>
                      <span>{scan.date}</span>
                      <span>{scan.result.disease.replaceAll('_', ' ')}</span>
                      <span>{(scan.result.confidence * 100).toFixed(2)}% confidence</span>
                    </div>
                    <span className="history-tag">Analyzed</span>
                    <button className="outline-button" onClick={() => openScan(scan)}>View</button>
                  </div>
                ))
              ) : (
                <EmptyState
                  text="Your analyzed scans will appear here."
                  button="Upload your first leaf"
                  onClick={() => setPage('upload')}
                />
              )}
            </div>
          </section>
        )}

        {page === 'dashboard' && (
          <section className="page-content">
            <PageHeading eyebrow="INSIGHTS & OVERVIEW" title="Dashboard" description="A summary of your saved crop analysis." />

            <div className="stats-grid">
              <StatCard icon="⌁" color="mint" label="Total Scans" value={totalScans} note="Database records" />
              <StatCard icon="♡" color="lime" label="Healthy Crops" value={healthyScans} note="Healthy predictions" />
              <StatCard icon="⚠" color="peach" label="Disease Alerts" value={diseaseAlerts} note="Disease predictions" />
              <StatCard icon="✚" color="lavender" label="Recommendations" value={diseaseAlerts} note="Scans to review" />
            </div>

            <div className="dashboard-grid">
              <div className="panel chart-panel">
                <div className="panel-heading">
                  <div><h3>Recent Analysis</h3><p>Your latest database records</p></div>
                  <button className="text-button" onClick={() => setPage('history')}>View history →</button>
                </div>

                {scanHistory.length > 0 ? (
                  scanHistory.slice(0, 5).map((scan) => (
                    <Activity
                      key={scan.id}
                      icon="🌿"
                      name={`${scan.result.plant} - ${scan.result.disease.replaceAll('_', ' ')}`}
                      date={scan.date}
                      tag={`${(scan.result.confidence * 100).toFixed(1)}%`}
                    />
                  ))
                ) : (
                  <EmptyState text="No saved scans yet." button="Upload a leaf" onClick={() => setPage('upload')} />
                )}
              </div>

              <div className="panel health-panel">
                <h3>Crop Health Overview</h3>
                <div className="donut">
                  <div>
                    <strong>{totalScans ? Math.round((healthyScans / totalScans) * 100) : 0}%</strong>
                    <span>Healthy</span>
                  </div>
                </div>
                <div className="legend">
                  <span><i className="legend-green" />Healthy <b>{healthyScans}</b></span>
                  <span><i className="legend-orange" />Needs review <b>{diseaseAlerts}</b></span>
                </div>
              </div>
            </div>
          </section>
        )}

        {page === 'about' && (
          <section className="page-content">
            <PageHeading eyebrow="ABOUT AGROSCAN" title="How It Works" description="A simple workflow for crop image screening." />

            <div className="about-hero">
              <div>
                <span className="hero-tag">FROM LEAF TO INSIGHT</span>
                <h2>Technology supporting<br />healthier farming.</h2>
                <p>AgroScan is a crop health screening system designed to help farmers organize leaf images, review AI results, and learn about crop care.</p>
              </div>
              <div className="about-emoji">🌾🌿</div>
            </div>

            <div className="steps-grid">
              <StepCard number="01" icon="📷" title="Upload a leaf" text="Choose a clear photo from your device." />
              <StepCard number="02" icon="🤖" title="AI analysis" text="The connected model evaluates image patterns." />
              <StepCard number="03" icon="🔎" title="Review results" text="Check the prediction and confidence." />
              <StepCard number="04" icon="🌱" title="Explore care" text="Review guidance and consult local experts." />
            </div>

            <div className="panel about-note">
              <h3>Project status</h3>
              <p>Crop predictions are processed by the backend AI model. Scan details are saved in the SQLite database and remain available after refreshing the page. Uploaded image files are not stored in the history database.</p>
            </div>
          </section>
        )}

        {page === 'team' && (
          <section className="page-content">
            <PageHeading eyebrow="THE PEOPLE BEHIND THE PROJECT" title="Meet Our Team" description="Working together for smarter crop care." />

            <div className="team-banner">
              <span>🌿</span>
              <div><h2>Growing better solutions, together.</h2><p>AgroScan · AI-Based Crop Disease Detection</p></div>
            </div>

            <div className="team-grid">
              {[
                { name: 'Priya', role: 'Project Team Member', symbol: 'P' },
                { name: 'Blessy', role: 'Project Team Member', symbol: 'B' },
                { name: 'Mukila', role: 'Project Team Member', symbol: 'M' },
                { name: 'Lemitha', role: 'Project Team Member', symbol: 'L' },
              ].map((member) => (
                <div className="panel member-card" key={member.name}>
                  <div className="member-avatar">{member.symbol}</div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                  <span className="member-badge">AgroScan Team</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="footer">
          <span>© 2026 AgroScan · Smart Crop Care</span>
          <span>Built for healthier harvests <b>♥</b></span>
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
      <div className="activity-text"><strong>{name}</strong><span>{date}</span></div>
      {tag && <span className={`activity-tag ${good ? 'good' : ''}`}>{tag}</span>}
    </div>
  )
}

function GuideItem({ number, title, text }) {
  return (
    <div className="guide-item">
      <span className="guide-number">{number}</span>
      <div><strong>{title}</strong><p>{text}</p></div>
    </div>
  )
}

function EmptyState({ text, button, onClick }) {
  return (
    <div className="empty-state">
      <span>🌿</span>
      <h3>Nothing here yet</h3>
      <p>{text}</p>
      <button className="primary-button" onClick={onClick}>{button}</button>
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
