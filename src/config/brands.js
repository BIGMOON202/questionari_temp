import superpharmTopLogo from '../assets/images/superpharm_4x.png'
import ramilevyTopLogo from '../assets/images/ramilevy_4x.png'
import goodpharmTopLogo from '../assets/images/goodpharm_4x.png'
import yochananaofTopLogo from '../assets/images/yochananof_4x.png'

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
    logo: superpharmTopLogo,
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
          description: 'התחרות מבוססת על זמן ומענה מדויק',
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
    },
  },
  ramilevy: {
    slug: 'ramilevy',
    id: 'ramilevy',
    campaignName: 'רמי לוי שיווק השקמה',
    logo: ramilevyTopLogo,
    submissionsTable: submissionsTableFromEnv(
      'VITE_SUPABASE_SUBMISSIONS_TABLE_RAMILEVY',
      'questionnaire_submissions_ramilevy',
    ),
    questions: superPharmQuestions,
    home: {
      heroLines: ['סוד מזמינה אותך להשתתף בתחרות ולזכות במגוון', 'פרסים שווים!'],
      heroQuestionLines: ['רכשת לפחות 3 מוצרי סוד מרככים', 'מרוכזים ברשת רמי לוי שיווק השקמה?'],
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
          description: 'התחרות מבוססת על זמן ומענה מדויק',
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
    },
  },
  ramilevygoodpharm: {
    slug: 'ramilevygoodpharm',
    id: 'ramilevygoodpharm',
    campaignName: 'GOOD PHARM',
    logo: goodpharmTopLogo,
    submissionsTable: submissionsTableFromEnv(
      'VITE_SUPABASE_SUBMISSIONS_TABLE_GOODPHARM',
      'questionnaire_submissions_goodpharm',
    ),
    questions: superPharmQuestions,
    home: {
      heroLines: ['סוד מזמינה אותך להשתתף בתחרות ולזכות במגוון', 'פרסים שווים!'],
      heroQuestionLines: ['רכשת לפחות 3 מוצרי סוד מרככים', 'מרוכזים ברשת GOOD PHARM?'],
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
          description: 'התחרות מבוססת על זמן ומענה מדויק',
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
    },
  },
  yochananof: {
    slug: 'yochananof',
    id: 'yochananof',
    campaignName: 'יוחננוף',
    logo: yochananaofTopLogo,
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
          description: 'התחרות מבוססת על זמן ומענה מדויק',
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
    },
  },
}

export const brandSlugs = Object.keys(brands)

export function getBrandBySlug(slug) {
  return brands[slug] ?? null
}
