import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useBrand } from '../../context/BrandContext.jsx'
import playgroundLogo from '../../assets/images/playground_new.svg'
import superpharmRegulationsPdf from '../../assets/Superpharm Fabric Softener Policy 2026.pdf'
import ramiLevyRegulationsPdf from '../../assets/Rami Levy Regulations.pdf'
import goodPharmRegulationsPdf from '../../assets/Good Pharm Regulations.pdf'
import yochananofRegulationsPdf from '../../assets/Yohananoff Regulations.doc.pdf'
import './personalDetailsPage.css'

function buildInitialForm(showNetworkSelect) {
  return {
    fullName: '',
    phone: '',
    email: '',
    ...(showNetworkSelect ? { network: '' } : {}),
  }
}

const termsDocsByBrand = {
  superpharm: {
    default: {
      title: 'תקנון התחרות',
      src: superpharmRegulationsPdf,
    },
  },
  ramilevygoodpharm: {
    ramiLevy: {
      title: 'תקנון רמי לוי שיווק השקמה',
      src: ramiLevyRegulationsPdf,
    },
    goodPharm: {
      title: 'תקנון GOOD PHARM',
      src: goodPharmRegulationsPdf,
    },
    default: {
      title: 'תקנון רמי לוי / GOOD PHARM',
      src: ramiLevyRegulationsPdf,
    },
  },
  yochananof: {
    default: {
      title: 'תקנון יוחננוף',
      src: yochananofRegulationsPdf,
    },
  },
}

export function PersonalDetailsPage() {
  const navigate = useNavigate()
  const brand = useBrand()
  const { logo, campaignName, personal } = brand
  const showNetworkSelect = personal.showNetworkSelect
  const networkOptions = personal.networkOptions ?? []

  const [form, setForm] = useState(() => buildInitialForm(showNetworkSelect))
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const [activeTermsDoc, setActiveTermsDoc] = useState('default')
  const [isNetworkDropdownOpen, setIsNetworkDropdownOpen] = useState(false)
  const [isHeaderLogoLoaded, setIsHeaderLogoLoaded] = useState(false)
  const termsModalCloseRef = useRef(null)
  const networkSelectRef = useRef(null)

  const isFormFilled = useMemo(() => {
    const requiredStrings = Object.entries(form).filter(([, v]) => typeof v === 'string')
    return requiredStrings.every(([, value]) => value.trim() !== '')
  }, [form])

  const canProceed = isFormFilled && acceptedTerms
  const termsDocConfig =
    termsDocsByBrand[brand.slug]?.[activeTermsDoc] ??
    termsDocsByBrand[brand.slug]?.default ??
    termsDocsByBrand.superpharm.default

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function closeTermsModal() {
    setIsTermsModalOpen(false)
  }

  function openTermsModal(docType = 'default') {
    setActiveTermsDoc(docType)
    setIsTermsModalOpen(true)
  }

  function goNext() {
    if (!canProceed) return
    sessionStorage.setItem('personalDetails', JSON.stringify(form))
    sessionStorage.setItem('acceptedTerms', 'true')
    sessionStorage.setItem('submissionBrand', brand.slug)
    sessionStorage.setItem('submissionStartAt', String(Date.now()))
    sessionStorage.removeItem('submissionElapsedSeconds')
    sessionStorage.removeItem('submissionRefNumber')
    sessionStorage.removeItem('invoicePublicUrl')
    sessionStorage.removeItem('invoiceStoragePath')
    navigate('../questions')
  }

  useEffect(() => {
    if (!isTermsModalOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        if (isTermsModalOpen) closeTermsModal()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isTermsModalOpen])

  useEffect(() => {
    if (!isNetworkDropdownOpen) return
    function onPointerDown(e) {
      if (networkSelectRef.current && !networkSelectRef.current.contains(e.target)) {
        setIsNetworkDropdownOpen(false)
      }
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setIsNetworkDropdownOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isNetworkDropdownOpen])

  useEffect(() => {
    if (isTermsModalOpen) termsModalCloseRef.current?.focus()
  }, [isTermsModalOpen])

  return (
    <>
      <main className="personal-page" dir="rtl">
        <section className="personal-card">
          <div className="personal-scroll">
          <header className={`personal-header${isHeaderLogoLoaded ? '' : ' is-loading'}`}>
            <img
              className={`personal-header-logo${isHeaderLogoLoaded ? ' is-loaded' : ''}`}
              src={logo}
              alt={`לוגו מבצע ${campaignName}`}
              onLoad={() => setIsHeaderLogoLoaded(true)}
              onError={() => setIsHeaderLogoLoaded(true)}
            />
          </header>

          <div className="personal-content">
            <nav className="stepper" aria-label="שלבי ההשתתפות">
              <ol className="stepper-list">
                <li className="stepper-item is-active">
                  <span className="stepper-circle">1</span>
                  <span className="stepper-label">פרטים אישיים</span>
                </li>
                <li className="stepper-item">
                  <span className="stepper-circle">2</span>
                  <span className="stepper-label">שאלון</span>
                </li>
                <li className="stepper-item">
                  <span className="stepper-circle">3</span>
                  <span className="stepper-label">צילום חשבונית</span>
                </li>
              </ol>
            </nav>

            <form className="personal-form" id="personal-details-form" onSubmit={(e) => e.preventDefault()}>
              <div className="field-group">
                <label htmlFor="fullName">שם מלא</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="הקלידו שם מלא"
                  value={form.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                />
              </div>
              <div className="field-group">
                <label htmlFor="phone">מספר טלפון</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="הקלידו מספר טלפון"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>
              <div className="field-group">
                <label htmlFor="email">כתובת מייל</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="הקלידו כתובת מייל"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>
              {showNetworkSelect ? (
                <div className="field-group field-group--network">
                  <label id="network-field-label" htmlFor="network-select-trigger-btn">
                    רשת
                  </label>
                  <div
                    ref={networkSelectRef}
                    className={`network-select${isNetworkDropdownOpen ? ' is-open' : ''}`}
                  >
                    {isNetworkDropdownOpen ? (
                      <div className="network-select-panel" dir="rtl" aria-labelledby="network-field-label">
                        <div className="network-select-panel-header">
                          <button
                            type="button"
                            className="network-select-chevron-toggle"
                            aria-label="סגירת רשימה"
                            onClick={() => setIsNetworkDropdownOpen(false)}
                          >
                            <svg
                              className="network-select-chevron network-select-chevron--open"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden
                            >
                              <path
                                d="M6 9l6 6 6-6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                        <div className="network-select-options">
                          {networkOptions.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              className={`network-select-option${form.network === opt.id ? ' is-selected' : ''}`}
                              onClick={() => {
                                updateField('network', opt.id)
                                setIsNetworkDropdownOpen(false)
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        id="network-select-trigger-btn"
                        type="button"
                        className="network-select-trigger"
                        aria-haspopup="listbox"
                        aria-expanded={isNetworkDropdownOpen}
                        aria-labelledby="network-field-label"
                        onClick={() => setIsNetworkDropdownOpen(true)}
                      >
                        <span
                          className={`network-select-value${form.network ? '' : ' network-select-value--placeholder'}`}
                        >
                          {form.network
                            ? networkOptions.find((o) => o.id === form.network)?.label ?? 'בחר/י'
                            : 'בחר/י'}
                        </span>
                        <svg
                          className="network-select-chevron network-select-chevron--closed"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            d="M15 18l-6-6 6-6"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ) : null}

              <label className="terms-row">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                {personal.termsVariant === 'ramiGoodPharm' ? (
                  <span className="terms-text" dir="rtl">
                    <span className="terms-link-intro">אני מאשר/ת את </span>
                    <a
                      href="#"
                      className="terms-link terms-link-line terms-link-line--inline"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openTermsModal('ramiLevy')
                      }}
                    >
                      תקנון רמי לוי שיווק השקמה
                    </a>
                    <span aria-hidden="true"> / </span>
                    <a
                      href="#"
                      className="terms-link terms-link-line terms-link-line--block"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openTermsModal('goodPharm')
                      }}
                    >
                      תקנון GOOD PHARM
                    </a>
                  </span>
                ) : (
                  <span className="terms-text">
                    אני מאשר/ת את{' '}
                    <a
                      href="#"
                      className="terms-link"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        openTermsModal('default')
                      }}
                    >
                      תקנון התחרות
                    </a>
                  </span>
                )}
              </label>
            </form>

            <div className="personal-actions">
              <button type="button" className="personal-cta" disabled={!canProceed} onClick={goNext}>
                לשלב הבא
              </button>
            </div>

            <footer className="personal-footer-brand">
              <img src={playgroundLogo} alt="Playground" className="personal-playground-logo" />
            </footer>
          </div>
          </div>
        </section>

        {isTermsModalOpen &&
          createPortal(
            <div
              className="terms-modal-root"
              role="dialog"
              aria-modal="true"
              aria-labelledby="terms-modal-title"
              dir="rtl"
            >
              <div className="terms-modal-backdrop" role="presentation" onClick={closeTermsModal} />
              <div className="terms-modal-panel">
                <button
                  ref={termsModalCloseRef}
                  type="button"
                  className="terms-modal-close"
                  aria-label="סגירה"
                  onClick={closeTermsModal}
                >
                  <span aria-hidden="true">×</span>
                </button>
                <h2 id="terms-modal-title" className="terms-modal-title">
                  תקנון התחרות
                </h2>
                <div className="terms-modal-body">
                  <a
                    className="terms-modal-download-btn"
                    href={termsDocConfig.src}
                    target="_blank"
                    rel="noreferrer"
                    download
                  >
                    הורדת התקנון
                  </a>
                  <object
                    className="terms-modal-pdf"
                    data={termsDocConfig.src}
                    type="application/pdf"
                    aria-label={termsDocConfig.title}
                  >
                    <embed
                      src={termsDocConfig.src}
                      type="application/pdf"
                      className="terms-modal-pdf"
                      aria-label={termsDocConfig.title}
                    />
                    <div className="terms-modal-pdf-fallback">
                      <p>לא ניתן להציג את התקנון בדפדפן זה.</p>
                      <a
                        href={termsDocConfig.src}
                        target="_blank"
                        rel="noreferrer"
                        className="terms-modal-download-inline"
                      >
                        פתיחת התקנון
                      </a>
                    </div>
                  </object>
                </div>
              </div>
            </div>,
            document.body,
          )}

      </main>
    </>
  )
}
