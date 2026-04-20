import logo1 from '../assets/images/logo1.png'
import logo2 from '../assets/images/logo2.png'
import logo3 from '../assets/images/logo3.png'

function submissionsTableFromEnv(specificKey, fallback) {
  const specific = import.meta.env[specificKey]
  if (typeof specific === 'string' && specific.trim() !== '') return specific.trim()
  return fallback
}

/** @typedef {{ id: string; title: string; description: string }} ParticipationStep */
/** @typedef {{ place: string; main: string; sub?: string }} PrizeItem */
/** @typedef {{ id: string; title: string; options: string[]; layout?: 'grid' }} QuizQuestion */

/** @type {QuizQuestion[]} */
const superPharmQuestions = [
  {
    id: 'q1',
    title: 'באיזו שנה הושק מותג סוד בישראל?',
    options: ['1993', '1982', '1978', '2001'],
  },
  {
    id: 'q2',
    title: 'כמה כביסות משפחה ישראלית ממוצעת עושה בשבוע?',
    options: ['1-2', '3-5', '6-10', 'יותר מ-10'],
  },
  {
    id: 'q3',
    title: 'איזה מהמותגים הבאים שייך גם להנקל?',
    options: ['אלביב', 'פרוול', 'לנור', 'בדין'],
    layout: 'grid',
  },
  {
    id: 'q4',
    title: 'איזה מוצר חדש הצטרף לאחרונה למשפחת סוד?',
    options: ['סוד לניקוי כלים', 'סוד 3 ב-1', 'סוד 5 ב-1', 'סוד מרכך לבגדי ספורט'],
  },
  {
    id: 'q5',
    title: 'איזה שם של סוד מרכך מרוכז לא קיים?',
    options: ['גולד', 'פרש סי', "ג'ונגל", 'בייבי'],
    layout: 'grid',
  },
]

export const brands = {
  superpharm: {
    slug: 'superpharm',
    id: 'superpharm',
    campaignName: 'סופר-פארם',
    logo: logo1,
    submissionsTable: submissionsTableFromEnv(
      'VITE_SUPABASE_SUBMISSIONS_TABLE_SUPERPHARM',
      import.meta.env.VITE_SUPABASE_SUBMISSIONS_TABLE?.trim() || 'questionnaire_submissions',
    ),
    questions: superPharmQuestions,
    home: {
      heroLines: ['סוד מזמינה אותך להשתתף בתחרות ולזכות במגוון', 'פרסים שווים!'],
      heroQuestionLines: ['רכשת לפחות 2 מוצרי סוד מרככים', 'מרוכזים בסופר פארם?'],
      heroNoteLines: ['זו ההזדמנות שלך להשתתף בתחרות בלעדית', 'ולהתפנק בפרסים שווים במיוחד!'],
      prizes: [
        {
          place: 'מקום 1-10',
          main: 'שובר ביימי על סך 1,100 ש"ח למכונת כביסה',
          sub: '+ מארז מרככי סוד לחצי שנה',
        },
        {
          place: 'מקום 11-20',
          main: 'מארז מוצרים מבית הנקל סוד',
          sub: 'בשווי 350 ש"ח לכל זוכה',
        },
      ],
      participationSteps: [
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
      ],
    },
    personal: {
      showNetworkSelect: false,
      termsVariant: 'default',
    },
  },
  ramilevygoodpharm: {
    slug: 'ramilevygoodpharm',
    id: 'ramilevygoodpharm',
    campaignName: 'רמי לוי / גוד פארם',
    logo: logo2,
    submissionsTable: submissionsTableFromEnv(
      'VITE_SUPABASE_SUBMISSIONS_TABLE_RAMILEVY_GOOD_PHARM',
      'questionnaire_submissions_ramilevy_good_pharm',
    ),
    questions: superPharmQuestions,
    home: {
      heroLines: ['סוד מזמינה אותך להשתתף בתחרות ולזכות במגוון', 'פרסים שווים!'],
      heroQuestionLines: ['רכשת לפחות 3 מוצרי סוד מרככים', 'מרוכזים ברשת רמי לוי או גוד פארם?'],
      heroNoteLines: ['זו ההזדמנות שלך להשתתף בתחרות בלעדית', 'ולהתפנק בפרסים שווים במיוחד!'],
      prizes: [
        {
          place: 'מקום 1',
          main: 'שובר ביימי בשווי 3,000 שקלים!',
        },
        {
          place: 'מקום 2',
          main: 'שובר ביימי בסך 1,000 שקלים!',
          sub: 'ועשרת הזוכים הבאים יזכו במארז של סוד מרככים מרוכזים בשווי 400 שקלים!',
        },
      ],
      participationSteps: [
        {
          id: 1,
          title: 'ממלאים פרטים אישיים',
          description: 'כל הפרטים נשמרים במערכת מאובטחת',
        },
        {
          id: 2,
          title: 'עונים על שאלון קצר',
          description: 'התחרות מבוססת על זמן מענה מדויק',
        },
        {
          id: 3,
          title: 'מעלים צילום חשבונית',
          description:
            'מעלים צילום של חשבונית המעידה על רכישה של לפחות 3 מוצרי סוד מרכך מרוכז',
        },
      ],
    },
    personal: {
      showNetworkSelect: true,
      networkOptions: [
        { id: 'rami-levy-shivuk-hashikma', label: 'רמי לוי שיווק השקמה' },
        { id: 'good-pharm', label: 'GOOD PHARM' },
      ],
      termsVariant: 'ramiGoodPharm',
    },
  },
  yochananof: {
    slug: 'yochananof',
    id: 'yochananof',
    campaignName: 'יוחננוף',
    logo: logo3,
    submissionsTable: submissionsTableFromEnv(
      'VITE_SUPABASE_SUBMISSIONS_TABLE_YOCHANANOF',
      'questionnaire_submissions_yochananof',
    ),
    questions: superPharmQuestions,
    home: {
      heroLines: ['סוד מזמינה אותך להשתתף בתחרות ולזכות במגוון', 'פרסים שווים!'],
      heroQuestionLines: ['רכשת לפחות 3 מוצרי סוד מרככים', 'מרוכזים ברשת יוחננוף?'],
      heroNoteLines: ['זו ההזדמנות שלך להשתתף בתחרות בלעדית', 'ולהתפנק בפרסים שווים במיוחד!'],
      prizes: [
        {
          place: 'מקום 1',
          main: 'שובר ביימי בשווי 2,000 שקלים!',
        },
        {
          place: 'מקום 2-5',
          main: 'מארז ממרככי סוד לשנה!',
          sub: 'ועשרת הזוכים הבאים יזכו במארז של סוד מרככים מרוכזים בשווי 400 שקלים!',
        },
      ],
      participationSteps: [
        {
          id: 1,
          title: 'ממלאים פרטים אישיים',
          description: 'כל הפרטים נשמרים במערכת מאובטחת',
        },
        {
          id: 2,
          title: 'עונים על שאלון קצר',
          description: 'התחרות מבוססת על זמן מענה מדויק',
        },
        {
          id: 3,
          title: 'מעלים צילום חשבונית',
          description:
            'מעלים צילום של חשבונית המעידה על רכישה של לפחות 3 מוצרי סוד מרכך מרוכז',
        },
      ],
    },
    personal: {
      showNetworkSelect: false,
      termsVariant: 'default',
    },
  },
}

export const brandSlugs = Object.keys(brands)

export function getBrandBySlug(slug) {
  return brands[slug] ?? null
}
