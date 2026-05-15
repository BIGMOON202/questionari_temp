# SOD Questionnaire (Multi-Brand)

A Hebrew (RTL) promotional questionnaire web app for the **SOD** fabric softener campaign. Participants complete a short flow—personal details, quiz, and invoice upload—and submissions are stored in **Supabase**. Reporting is handled outside this repo: when Supabase receives new rows, a connected **Google Sheet** is updated automatically via your Supabase-side integration.

## Tech stack

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) 7
- [Supabase](https://supabase.com/) (database, storage, anon client from the browser)

## Campaign routes (sub-URLs)

Each retail partner has its own path. All routes share the same step structure; copy, logos, terms PDFs, and Supabase tables can differ per brand.

| Path | Brand |
|------|--------|
| `/superpharm` | Super-Pharm |
| `/ramilevy` | Rami Levy (שיווק השקמה) |
| `/ramilevygoodpharm` | GOOD PHARM |
| `/yochananof` | Yochananof |

**Legacy redirects**

- `/` → `/superpharm`
- `/goodpharm` → `/ramilevygoodpharm` (and nested paths, e.g. `/goodpharm/personal`)

**Example full flow**

```
/superpharm → /superpharm/personal → /superpharm/questions → /superpharm/invoice → /superpharm/confirmation
```

## User flow

1. **Home** — campaign intro, prizes, participation steps  
2. **Personal details** — name, phone, email, terms acceptance (brand-specific PDF)  
3. **Questions** — timed quiz; answers stored in `sessionStorage`  
4. **Invoice** — photo/PDF upload to Supabase Storage; row inserted into the brand’s submissions table  
5. **Confirmation** — reference number and success message  

## Data flow

```
Browser (React app)
    │
    ├─► Supabase Storage  (invoice images/PDFs)
    │
    └─► Supabase Postgres (submissions table per brand)
              │
              └─► Google Sheets  (configured in Supabase / automation — not in this repo)
```

When the user finishes the **Invoice** step, the app:

1. Uploads the file to the `invoices` bucket (path: `invoices/{brandSlug}/...`).
2. Inserts one row into the brand’s submissions table with personal details, quiz answers, timing, reference number, invoice URLs, and (for Rami Levy / Good Pharm) a `network` label.

Google Sheets sync is **not implemented in this codebase**. It runs on the Supabase project (e.g. integration, webhook, or third-party connector). After you change tables or columns in Supabase, update that integration so the sheet mapping stays correct.

## Project structure

```
src/
  app/App.jsx              # Routes and brand layout
  config/brands.js         # Per-brand copy, logos, Supabase table names
  context/BrandContext.jsx
  lib/supabaseClient.js    # Supabase client and bucket name
  pages/
    home/
    personal/
    questions/
    invoice/
    confirmation/
supabase/
  submission_tables.sql    # Example table definitions and RLS policies
```

## Prerequisites

- **Node.js** 18+ (20+ recommended)
- A **Supabase** project with:
  - Tables for each brand (see below)
  - Storage bucket for invoices (default name: `invoices`)
  - RLS policies allowing `anon` **insert** on submission tables (and upload to the bucket), if submissions come from the browser
- Environment variables (see next section)

## Local setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd questionariRamiLevi_temp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   Create a `.env` file in the project root (do not commit secrets):

   ```env
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-publishable-or-anon-key>
   VITE_SUPABASE_INVOICES_BUCKET=invoices

   # Optional — override default table names per brand
   VITE_SUPABASE_SUBMISSIONS_TABLE=questionnaire_submissions
   VITE_SUPABASE_SUBMISSIONS_TABLE_SUPERPHARM=questionnaire_submissions
   VITE_SUPABASE_SUBMISSIONS_TABLE_RAMILEVY_GOOD_PHARM=questionnaire_submissions_ramilevy_good_pharm
   VITE_SUPABASE_SUBMISSIONS_TABLE_YOCHANANOF=questionnaire_submissions_yochananof
   ```

   | Variable | Purpose |
   |----------|---------|
   | `VITE_SUPABASE_URL` | Supabase project URL |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | Public client key (publishable or anon) |
   | `VITE_SUPABASE_INVOICES_BUCKET` | Storage bucket for invoice uploads |
   | `VITE_SUPABASE_SUBMISSIONS_TABLE_*` | Postgres table name per brand (see `src/config/brands.js`) |

   **Rami Levy and Good Pharm** (`/ramilevy` and `/ramilevygoodpharm`) both write to the same table by default: `questionnaire_submissions_ramilevy_good_pharm`, controlled by `VITE_SUPABASE_SUBMISSIONS_TABLE_RAMILEVY_GOOD_PHARM`. The `network` column distinguishes `Rami Levy` vs `Good Pharm`.

4. **Prepare Supabase**

   - Run or adapt `supabase/submission_tables.sql` in the Supabase SQL Editor.
   - Ensure table columns match what the app sends (see [Submission payload](#submission-payload)).
   - Create the `invoices` storage bucket and policies for uploads.
   - Configure your Google Sheets ↔ Supabase sync on the Supabase side.

5. **Run locally**

   ```bash
   npm run dev
   ```

   Open the URL Vite prints (usually `http://localhost:5173`) and visit a brand path, e.g. `http://localhost:5173/superpharm`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |

## Deployment

The app is a static SPA. `vercel.json` rewrites all paths to `index.html` so client-side routes work on Vercel (or similar hosts).

1. Build: `npm run build`
2. Deploy the `dist/` folder (or connect the repo to Vercel/Netlify).
3. Set the same `VITE_*` variables in the host’s environment **before** build (Vite embeds them at build time).

## Submission payload

On successful submit (`InvoicePage`), a row is inserted with fields similar to:

| Field | Description |
|-------|-------------|
| `full_name` | From personal details |
| `phone` | Phone number |
| `email` | Email |
| `accepted_terms` | Terms checkbox |
| `answers` | JSON quiz answers |
| `elapsed_seconds` | Quiz duration (`MM:SS`) |
| `created_at` | ISO timestamp |
| `created_at_display` | Formatted local display string |
| `reference_number` | 5-digit reference shown on confirmation |
| `invoice_storage_path` | Path in Storage |
| `invoice_public_url` | Signed or public URL for the invoice |
| `network` | e.g. `Superpharm`, `Rami Levy`, `Good Pharm`, `Yochananof` (brand-dependent) |

Align your Supabase table schema (and Google Sheet columns) with these fields. The SQL file in `supabase/` may list additional legacy columns (`id_number`, `birth_date`); adjust the database or app if your live schema differs.

## Customizing a brand

Edit `src/config/brands.js`:

- Hero text, prizes, participation steps  
- Logo imports under `src/assets/images/`  
- `submissionsTable` and env key for Supabase  
- Quiz questions (shared `superPharmQuestions` by default)  

Terms PDFs for personal details are configured in `src/pages/personal/PersonalDetailsPage.jsx`.

## Security notes

- Only use the **publishable/anon** key in the frontend; never put the Supabase **service role** key in `VITE_*` variables.
- Restrict RLS policies to what you need (typically insert-only for anonymous submissions).
- Do not commit `.env` or real API keys to git.

## Troubleshooting

| Issue | Things to check |
|-------|------------------|
| Submit fails on invoice | Storage bucket name, upload policies, table RLS insert policy |
| Wrong sheet / no row in Sheets | Supabase → Google Sheets connector mapping and table name |
| Blank page on refresh for `/brand/...` | Host must SPA-rewrite to `index.html` (see `vercel.json`) |
| Missing env at build | `VITE_*` must be set when running `npm run build` |

## License

Private project — all rights reserved unless otherwise specified by the repository owner.
