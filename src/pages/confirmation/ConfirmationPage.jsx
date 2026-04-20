import { useEffect, useMemo, useState } from 'react'
import { useBrand } from '../../context/BrandContext.jsx'
import playgroundLogo from '../../assets/images/playground.png'
import successMarkIcon from '../../assets/images/success_mark.png'
import timerRightIcon from '../../assets/images/timer_right.png'
import timerLeftIcon from '../../assets/images/timer_left.png'
import numberRightIcon from '../../assets/images/number_right.png'
import numberLeftIcon from '../../assets/images/number_left.png'
import './confirmationPage.css'

function getSubmissionData() {
  const elapsedSeconds = Math.max(1, Number(sessionStorage.getItem('submissionElapsedSeconds') ?? 1))
  let refNumber = sessionStorage.getItem('submissionRefNumber')
  if (!refNumber) {
    refNumber = String(Math.floor(10000 + Math.random() * 90000))
    sessionStorage.setItem('submissionRefNumber', refNumber)
  }
  return { elapsedSeconds, refNumber }
}

function formatDuration(seconds) {
  const safeSeconds = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const remainSeconds = safeSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`
}

export function ConfirmationPage() {
  const brand = useBrand()
  const { logo, campaignName } = brand
  const { elapsedSeconds, refNumber } = useMemo(() => getSubmissionData(), [])
  const formattedDuration = useMemo(() => formatDuration(elapsedSeconds), [elapsedSeconds])
  const [showCelebration, setShowCelebration] = useState(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setShowCelebration(false)
    }, 2200)

    return () => window.clearTimeout(timeoutId)
  }, [])

  return (
    <main className="confirmation-page" dir="rtl">
      {showCelebration && (
        <div className="confirmation-fireworks" aria-hidden="true">
          <span className="firework firework--1" />
          <span className="firework firework--2" />
          <span className="firework firework--3" />
          <span className="firework firework--4" />
          <span className="firework firework--5" />
          <span className="firework firework--6" />
        </div>
      )}
      <section className="confirmation-card">
        <div className="confirmation-scroll">
          <header className="confirmation-header">
            <img
              className="confirmation-header-logo"
              src={logo}
              alt={`לוגו מבצע ${campaignName}`}
            />
          </header>

          <div className="confirmation-content">
            <div className="confirmation-success-icon" aria-hidden="true">
              <div className="confirmation-success-icon-inner">
                <img className="confirmation-success-mark" src={successMarkIcon} alt="" />
              </div>
            </div>
            <h1 className="confirmation-title">נשלח בהצלחה!</h1>
            <p className="confirmation-subtitle">תודה רבה על השתתפותך</p>
            <p className="confirmation-note">
              זוכים יעודכנו בסוף משך פעילות התחרות
              <br />
              שאלות/פניות: Henkelsoad@gmail.com
            </p>

            <div className="confirmation-info-list">
              <div className="confirmation-info-row">
                <img
                  className="confirmation-side-icon confirmation-side-icon--right"
                  src={timerRightIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div className="confirmation-info-text">
                  <div className="confirmation-info-label confirmation-info-label--time">זמן מענה</div>
                  <div className="confirmation-info-value">{formattedDuration}</div>
                </div>
                <img
                  className="confirmation-side-icon confirmation-side-icon--left"
                  src={timerLeftIcon}
                  alt=""
                  aria-hidden="true"
                />
              </div>

              <div className="confirmation-info-row">
                <img
                  className="confirmation-side-icon confirmation-side-icon--right"
                  src={numberRightIcon}
                  alt=""
                  aria-hidden="true"
                />
                <div className="confirmation-info-text">
                  <div className="confirmation-info-label confirmation-info-label--number">מספר טופס</div>
                  <div className="confirmation-info-value">#{refNumber}</div>
                </div>
                <img
                  className="confirmation-side-icon confirmation-side-icon--left"
                  src={numberLeftIcon}
                  alt=""
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="confirmation-footer-brand">
          <img src={playgroundLogo} alt="Playground" className="confirmation-playground-logo" />
        </footer>
      </section>
    </main>
  )
}

