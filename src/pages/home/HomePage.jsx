import { useNavigate } from 'react-router-dom'
import { storeScenarios } from '../../config/storeScenarios.js'
import logoImage from '../../assets/images/logo1.png'
import questionIcon from '../../assets/images/icon1.png'
import playgroundLogo from '../../assets/images/playground.png'
import './homePage.css'

const participationSteps = [
  {
    id: 1,
    title: 'ממלאים פרטים אישיים',
    description: 'כל הפרטים נשמרים במערכת מאובטחת',
  },
  {
    id: 2,
    title: 'עונים על שאלון קצר',
    description: 'השאלון קצר מאוד, קליל ונוגע לערכי המותג',
  },
  {
    id: 3,
    title: 'מעלים צילום חשבונית',
    description: 'החשבונית מעידה על רכישת 2 מוצרי סוד ברשת פרטי סופר פארם',
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const activeScenario = storeScenarios.superPharm

  return (
    <main className="mobile-home" dir="rtl">
      <section className="mobile-card">
        <div className="mobile-home-scroll">
        <img className="top-logo" src={logoImage} alt={`לוגו מבצע ${activeScenario.campaignName}`} />
        <div className="mobile-home-content">
        <header className="hero">
          <h1>
            סוד מזמינה אותך להשתתף בתחרות ולזכות במגוון
            <br />
            פרסים שווים!
          </h1>
          <div className="hero-question">
            <img src={questionIcon} alt="" aria-hidden="true" />
            <span className="hero-question-text">
              רכשת לפחות 2 מוצרי סוד מרככים
              <br />
              מרוכזים בסופר פארם?
            </span>
          </div>
          <p className="hero-note">זו ההזדמנות שלך להשתתף בתחרות בלעדית<br />ולהתפנק בפרסים שווים במיוחד!</p>
        </header>

        <section className="section">
          <h2>במה אפשר לזכות?</h2>
          <ul className="prize-list">
            <li>
              <span className="place">מקום 1-10</span>
              <p className="prize-main">שובר ביימי על סך 1,100 ש"ח למכונת כביסה</p>
              <p className="prize-sub">+ מארז מרככי סוד לחצי שנה</p>

            </li>
            <li>
              <span className="place">מקום 11-20</span>
              <p className="prize-main">מארז מוצרים מבית הנקל סוד</p>
              <p className="prize-sub">בשווי 350 ש"ח לכל זוכה</p>
            </li>
          </ul>
        </section>

        <section className="section">
          <h2 className="participants-title">איך משתתפים?</h2>
          <ol className="steps-list">
            {participationSteps.map((step) => (
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
        </div>
        </div>

        <div className="mobile-home-bottom">
          <button type="button" className="cta" onClick={() => navigate('/personal')}>
            בואו נתחיל
          </button>

          <footer className="page-footer">
            <p className="legal-copy">
              המנצחים/ות יהיו אלה שיענו נכון ובזמן הקצר ביותר
              על כל השאלות בצירוף חשבונית תקינה.
            </p>
            <img className="playground-logo" src={playgroundLogo} alt="Playground" />
          </footer>
        </div>
      </section>
    </main>
  )
}
