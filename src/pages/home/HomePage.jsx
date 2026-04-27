import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useBrand } from '../../context/BrandContext.jsx'
import questionIcon from '../../assets/images/icon1.png'
import playgroundLogo from '../../assets/images/playground_new.svg'
import './homePage.css'

export function HomePage() {
  const navigate = useNavigate()
  const brand = useBrand()
  const { home, logo, campaignName } = brand
  const legalCopy =
    home.legalCopy ??
    'המנצחים/ות יהיו אלה שיענו נכון ובזמן הקצר ביותר על כל השאלות בצירוף חשבונית תקינה.'

  const scrollRef = useRef(null)
  const afterStepsRef = useRef(null)
  const [ctaReady, setCtaReady] = useState(false)
  const [ctaInFinalPosition, setCtaInFinalPosition] = useState(false)

  const updateCtaReadiness = useCallback(() => {
    const scrollEl = scrollRef.current
    const anchorEl = afterStepsRef.current
    if (!scrollEl || !anchorEl) return

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCtaReady(true)
      setCtaInFinalPosition(true)
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = scrollEl
    const maxScroll = scrollHeight - clientHeight
    if (maxScroll <= 12) {
      setCtaReady(true)
      setCtaInFinalPosition(true)
      return
    }

    const scrollRect = scrollEl.getBoundingClientRect()
    const anchorRect = anchorEl.getBoundingClientRect()
    const progress = scrollTop / maxScroll
    const seenStepsBlock =
      anchorRect.top < scrollRect.bottom - 72 && anchorRect.bottom > scrollRect.top - 40
    const nearPageEnd = maxScroll - scrollTop <= 140 || progress >= 0.84

    setCtaReady(seenStepsBlock || progress >= 0.34)
    setCtaInFinalPosition(nearPageEnd)
  }, [])

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return
    updateCtaReadiness()
    scrollEl.addEventListener('scroll', updateCtaReadiness, { passive: true })
    const ro = new ResizeObserver(updateCtaReadiness)
    ro.observe(scrollEl)
    return () => {
      scrollEl.removeEventListener('scroll', updateCtaReadiness)
      ro.disconnect()
    }
  }, [updateCtaReadiness, legalCopy, home])

  const fab = createPortal(
    <button
      type="button"
      className={`cta home-fab${ctaInFinalPosition ? ' home-fab--final' : ''}${ctaReady ? '' : ' cta--pending'}`}
      disabled={!ctaReady}
      onClick={() => navigate('personal')}
    >
      בואו נתחיל
    </button>,
    document.body,
  )

  return (
    <>
      <main className="mobile-home" dir="rtl">
        <section className="mobile-card">
          <div ref={scrollRef} className="mobile-home-scroll">
            <header className="top-logo-wrap">
              <img className="top-logo" src={logo} alt={`לוגו מבצע ${campaignName}`} />
            </header>
            <div className="mobile-home-content">
              <header className="hero">
                <h1>
                  {home.heroLines.flatMap((line, i) =>
                    i === 0 ? [line] : [<br key={`hero-br-${i}`} />, line],
                  )}
                </h1>
                <div className="hero-question">
                  <img src={questionIcon} alt="" aria-hidden="true" />
                  <span className="hero-question-text">
                    {home.heroQuestionLines.flatMap((line, i) =>
                      i === 0 ? [line] : [<br key={`q-br-${i}`} />, line],
                    )}
                  </span>
                </div>
                <p className="hero-note">
                  {home.heroNoteLines.flatMap((line, i) =>
                    i === 0 ? [line] : [<br key={`note-br-${i}`} />, line],
                  )}
                </p>
              </header>

              <section className="section">
                <h2>במה אפשר לזכות?</h2>
                <ul className="prize-list">
                  {home.prizes.map((prize) => (
                    <li key={prize.place}>
                      <span className="place">{prize.place}</span>
                      <p className="prize-main">{prize.main}</p>
                      {prize.sub ? <p className="prize-sub">{prize.sub}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="section">
                <h2 className="participants-title">איך משתתפים?</h2>
                <ol className="steps-list">
                  {home.participationSteps.map((step) => (
                    <li key={step.id}>
                      <div>
                        <h3>{step.title}</h3>
                        <p>{step.description}</p>
                      </div>
                      <span>{step.id}</span>
                    </li>
                  ))}
                </ol>
              </section>

              <div ref={afterStepsRef} className="home-readiness-anchor" aria-hidden />

              <div className="home-fab-slot" aria-hidden />

              <footer className="page-footer">
                <p className="legal-copy">{legalCopy}</p>
                <img className="playground-logo" src={playgroundLogo} alt="Playground" />
              </footer>
            </div>
          </div>
        </section>
      </main>
      {fab}
    </>
  )
}
