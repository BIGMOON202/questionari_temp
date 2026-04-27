import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBrand } from '../../context/BrandContext.jsx'
import playgroundLogo from '../../assets/images/playground_new.svg'
import './questionsPage.css'

export function QuestionsPage() {
  const navigate = useNavigate()
  const brand = useBrand()
  const { questions, logo, campaignName } = brand

  const [activeIndex, setActiveIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const activeQuestion = questions[activeIndex]
  const selected = answers[activeQuestion.id]

  function selectOption(option) {
    setAnswers((prev) => ({ ...prev, [activeQuestion.id]: option }))
  }

  function goNext() {
    if (!selected) return
    if (isLast) {
      sessionStorage.setItem('questionAnswers', JSON.stringify(answers))
      const startAt = Number(sessionStorage.getItem('submissionStartAt') ?? 0)
      if (startAt > 0) {
        const elapsedSeconds = Math.max(1, Math.round((Date.now() - startAt) / 1000))
        sessionStorage.setItem('submissionElapsedSeconds', String(elapsedSeconds))
      }
      navigate('../invoice')
      return
    }
    setActiveIndex((prev) => Math.min(prev + 1, questions.length - 1))
  }

  const isLast = activeIndex === questions.length - 1

  return (
    <main className="questions-page" dir="rtl">
      <section className="questions-card">
        <div className="questions-scroll">
          <header
            className="questions-header"
          >
            <img className="questions-header-logo" src={logo} alt={`לוגו מבצע ${campaignName}`} />
          </header>

          <div className="questions-content">
            <nav className="stepper" aria-label="שלבי ההשתתפות">
              <ol className="stepper-list">
                <li className="stepper-item is-active">
                  <span className="stepper-circle">1</span>
                  <span className="stepper-label">פרטים אישיים</span>
                </li>
                <li className="stepper-item is-active">
                  <span className="stepper-circle">2</span>
                  <span className="stepper-label">שאלון</span>
                </li>
                <li className="stepper-item">
                  <span className="stepper-circle">3</span>
                  <span className="stepper-label">צילום חשבונית</span>
                </li>
              </ol>
            </nav>

            <section className="question" aria-label={`שאלה ${activeIndex + 1} מתוך ${questions.length}`}>
              <div className="question-title-wrap">
                <h1 className="question-title">{activeQuestion.title}</h1>
                <div className="question-number" aria-hidden="true">
                  {String(activeIndex + 1).padStart(2, '0')}
                </div>
              </div>

              <div
                className={`question-options${activeQuestion.layout === 'grid' ? ' is-grid' : ''}`}
                role="radiogroup"
                aria-label="תשובות אפשריות"
              >
                {activeQuestion.options.map((option) => {
                  const isSelected = selected === option
                  return (
                    <button
                      key={option}
                      type="button"
                      className={`question-option${isSelected ? ' is-selected' : ''}`}
                      onClick={() => selectOption(option)}
                      role="radio"
                      aria-checked={isSelected}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </section>

            <div className="questions-actions">
              <button type="button" className="questions-cta" disabled={!selected} onClick={goNext}>
                לשלב הבא
              </button>
            </div>

            <footer className="questions-footer-brand">
              <img src={playgroundLogo} alt="Playground" className="questions-playground-logo" />
            </footer>
          </div>
        </div>
      </section>
    </main>
  )
}
