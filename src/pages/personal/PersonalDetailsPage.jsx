import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { storeScenarios } from '../../config/storeScenarios.js'
import logoImage from '../../assets/images/logo1.png'
import playgroundLogo from '../../assets/images/playground.png'
import './personalDetailsPage.css'

const initialForm = {
  fullName: '',
  idNumber: '',
  phone: '',
  email: '',
  birthDate: '',
}

export function PersonalDetailsPage() {
  const navigate = useNavigate()
  const activeScenario = storeScenarios.superPharm
  const [form, setForm] = useState(initialForm)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
  const termsModalCloseRef = useRef(null)
  const isFormFilled = Object.values(form).every((value) => value.trim() !== '')
  const canProceed = isFormFilled && acceptedTerms

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function formatBirthDate(value) {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 8)

    if (digitsOnly.length <= 2) return digitsOnly
    if (digitsOnly.length <= 4) return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`
    return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4)}`
  }

  function closeTermsModal() {
    setIsTermsModalOpen(false)
  }

  function goNext() {
    if (!canProceed) return
    sessionStorage.setItem('personalDetails', JSON.stringify(form))
    sessionStorage.setItem('acceptedTerms', 'true')
    sessionStorage.setItem('submissionStartAt', String(Date.now()))
    sessionStorage.removeItem('submissionElapsedSeconds')
    sessionStorage.removeItem('submissionRefNumber')
    sessionStorage.removeItem('invoicePublicUrl')
    sessionStorage.removeItem('invoiceStoragePath')
    navigate('/questions')
  }

  useEffect(() => {
    if (!isTermsModalOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e) {
      if (e.key === 'Escape') closeTermsModal()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isTermsModalOpen])

  useEffect(() => {
    if (isTermsModalOpen) termsModalCloseRef.current?.focus()
  }, [isTermsModalOpen])

  return (
    <main className="personal-page" dir="rtl">
      <section className="personal-card">
        <div className="personal-scroll">
          <header className="personal-header">
            <img
              className="personal-header-logo"
              src={logoImage}
              alt={`לוגו מבצע ${activeScenario.campaignName}`}
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
                <label htmlFor="idNumber">תעודת זהות</label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  inputMode="numeric"
                  placeholder="הקלידו מספר תעודת זהות"
                  value={form.idNumber}
                  onChange={(e) => updateField('idNumber', e.target.value)}
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
              <div className="field-group">
                <label htmlFor="birthDate">תאריך לידה</label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="dd/mm/yyyy"
                  value={form.birthDate}
                  onChange={(e) => updateField('birthDate', formatBirthDate(e.target.value))}
                />
              </div>

              <label className="terms-row">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <span className="terms-text">
                  אני מאשר/ת את{' '}
                  <a
                    href="#"
                    className="terms-link"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setIsTermsModalOpen(true)
                    }}
                  >
                    תקנון התחרות
                  </a>
                </span>
              </label>
            </form>
          </div>
        </div>

        <div className="personal-bottom">
          <button
            type="button"
            className="personal-cta"
            disabled={!canProceed}
            onClick={goNext}
          >
            לשלב הבא
          </button>
          <footer className="personal-footer-brand">
            <img src={playgroundLogo} alt="Playground" className="personal-playground-logo" />
          </footer>
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
            <div
              className="terms-modal-backdrop"
              role="presentation"
              onClick={closeTermsModal}
            />
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
                תקנון אתר
              </h2>
              <div className="terms-modal-body">
                <p className="terms-modal-placeholder">
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  )
}
