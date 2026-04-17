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
  const [isBirthDateModalOpen, setIsBirthDateModalOpen] = useState(false)
  const [birthDateView, setBirthDateView] = useState(() => {
    const today = new Date()
    return { month: today.getMonth(), year: today.getFullYear() }
  })
  const termsModalCloseRef = useRef(null)
  const isFormFilled = Object.values(form).every((value) => value.trim() !== '')
  const canProceed = isFormFilled && acceptedTerms
  const selectedBirthDate = form.birthDate ? new Date(form.birthDate) : null

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleIdNumberChange(value) {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 9)
    updateField('idNumber', digitsOnly)
  }

  function formatBirthDateForDisplay(value) {
    if (!value) return ''
    const [year, month, day] = value.split('-')
    if (!year || !month || !day) return ''
    return `${day}/${month}/${year}`
  }

  function openBirthDateModal() {
    if (form.birthDate) {
      const selectedDate = new Date(form.birthDate)
      setBirthDateView({ month: selectedDate.getMonth(), year: selectedDate.getFullYear() })
    } else {
      const today = new Date()
      setBirthDateView({ month: today.getMonth(), year: today.getFullYear() })
    }
    setIsBirthDateModalOpen(true)
  }

  function closeBirthDateModal() {
    setIsBirthDateModalOpen(false)
  }

  function handleBirthDateSelect(date) {
    const year = String(date.getFullYear())
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    updateField('birthDate', `${year}-${month}-${day}`)
    closeBirthDateModal()
  }

  function changeBirthDateMonth(delta) {
    const next = new Date(birthDateView.year, birthDateView.month + delta, 1)
    setBirthDateView({ month: next.getMonth(), year: next.getFullYear() })
  }

  const monthStartDay = new Date(birthDateView.year, birthDateView.month, 1).getDay()
  const daysInMonth = new Date(birthDateView.year, birthDateView.month + 1, 0).getDate()
  const leadingEmptyCells = Array.from({ length: monthStartDay })
  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const date = new Date(birthDateView.year, birthDateView.month, day)
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return { day, date, iso }
  })
  const monthLabel = new Intl.DateTimeFormat('he-IL', { month: 'long', year: 'numeric' }).format(
    new Date(birthDateView.year, birthDateView.month, 1),
  )

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
    if (!isTermsModalOpen && !isBirthDateModalOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        if (isBirthDateModalOpen) closeBirthDateModal()
        if (isTermsModalOpen) closeTermsModal()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isBirthDateModalOpen, isTermsModalOpen])

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
                  maxLength={9}
                  pattern="[0-9]{9}"
                  placeholder="הקלידו מספר תעודת זהות"
                  value={form.idNumber}
                  onChange={(e) => handleIdNumberChange(e.target.value)}
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
                  className="birth-date-input"
                  placeholder="dd/mm/yyyy"
                  value={formatBirthDateForDisplay(form.birthDate)}
                  readOnly
                  onClick={openBirthDateModal}
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

      {isBirthDateModalOpen &&
        createPortal(
          <div className="birthdate-modal-root" role="dialog" aria-modal="true" aria-labelledby="birthdate-title">
            <div className="birthdate-modal-backdrop" role="presentation" onClick={closeBirthDateModal} />
            <div className="birthdate-modal-panel" dir="rtl">
              <h2 id="birthdate-title" className="birthdate-modal-title">
                בחירת תאריך לידה
              </h2>
              <div className="birthdate-calendar-header">
                <button
                  type="button"
                  className="birthdate-nav-btn"
                  aria-label="חודש הבא"
                  onClick={() => changeBirthDateMonth(1)}
                >
                  ‹
                </button>
                <p className="birthdate-month-label">{monthLabel}</p>
                <button
                  type="button"
                  className="birthdate-nav-btn"
                  aria-label="חודש קודם"
                  onClick={() => changeBirthDateMonth(-1)}
                >
                  ›
                </button>
              </div>
              <div className="birthdate-weekdays" aria-hidden="true">
                {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map((weekday) => (
                  <span key={weekday} className="birthdate-weekday">
                    {weekday}
                  </span>
                ))}
              </div>
              <div className="birthdate-calendar-grid">
                {leadingEmptyCells.map((_, index) => (
                  <span key={`empty-${index}`} className="birthdate-empty-cell" />
                ))}
                {calendarDays.map((calendarDay) => {
                  const isSelected = selectedBirthDate?.toISOString().slice(0, 10) === calendarDay.iso
                  return (
                    <button
                      key={calendarDay.iso}
                      type="button"
                      className={`birthdate-day-btn${isSelected ? ' is-selected' : ''}`}
                      onClick={() => handleBirthDateSelect(calendarDay.date)}
                    >
                      {calendarDay.day}
                    </button>
                  )
                })}
              </div>
              <div className="birthdate-modal-actions">
                <button
                  type="button"
                  className="birthdate-modal-btn birthdate-modal-btn--ghost"
                  onClick={closeBirthDateModal}
                >
                  ביטול
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </main>
  )
}
