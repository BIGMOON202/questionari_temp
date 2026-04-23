import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useBrand } from '../../context/BrandContext.jsx'
import playgroundLogo from '../../assets/images/playground.png'
import uploadIcon from '../../assets/images/upload_icon.png'
import cameraIcon from '../../assets/images/camera.png'
import { invoicesBucket, supabase } from '../../lib/supabaseClient.js'
import './invoicePage.css'

function pad2(value) {
  return String(value).padStart(2, '0')
}

function formatElapsedSecondsToMmSs(totalSeconds) {
  const safeSeconds = Math.max(1, Number(totalSeconds) || 1)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60
  return `${pad2(minutes)}:${pad2(seconds)}`
}

function formatDateToDdMmYyyyHhMm(dateValue) {
  const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`
}

async function buildInvoiceAccessUrl(filePath) {
  const storage = supabase.storage.from(invoicesBucket)
  const { data: publicData } = storage.getPublicUrl(filePath)
  const publicUrl = publicData?.publicUrl ?? ''

  const { data: signedData } = await storage.createSignedUrl(filePath, 60 * 60 * 24 * 365 * 5)
  const signedUrl = signedData?.signedUrl ?? ''

  // Prefer signed URL so links work even when bucket is private.
  return signedUrl || publicUrl
}

export function InvoicePage() {
  const navigate = useNavigate()
  const brand = useBrand()
  const { logo, campaignName, submissionsTable, slug: brandSlug, personal } = brand
  const [invoiceFile, setInvoiceFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const galleryInputRef = useRef(null)
  const cameraInputRef = useRef(null)
  const fileInputRef = useRef(null)

  function onPickInvoice() {
    setIsPickerOpen(true)
  }

  function pickFromGallery() {
    setIsPickerOpen(false)
    galleryInputRef.current?.click()
  }

  function pickFromCamera() {
    setIsPickerOpen(false)
    cameraInputRef.current?.click()
  }

  function pickFromFiles() {
    setIsPickerOpen(false)
    fileInputRef.current?.click()
  }

  function onFileChange(event) {
    const selected = event.target.files?.[0] ?? null
    setInvoiceFile(selected)
    setErrorMessage('')
  }

  useEffect(() => {
    if (!isPickerOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKeyDown(e) {
      if (e.key === 'Escape') setIsPickerOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isPickerOpen])

  async function handleFinish() {
    if (!invoiceFile) {
      setErrorMessage('יש להעלות צילום חשבונית לפני סיום')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const personalDetailsRaw = sessionStorage.getItem('personalDetails')
      const answersRaw = sessionStorage.getItem('questionAnswers')

      if (!personalDetailsRaw || !answersRaw) {
        throw new Error('חסרים פרטים מהשלבים הקודמים')
      }

      const personalDetails = JSON.parse(personalDetailsRaw)
      const answers = JSON.parse(answersRaw)
      const elapsedSeconds = Math.max(1, Number(sessionStorage.getItem('submissionElapsedSeconds') ?? 1))
      const elapsedMmSs = formatElapsedSecondsToMmSs(elapsedSeconds)
      const createdAt = new Date()
      const createdAtFormatted = formatDateToDdMmYyyyHhMm(createdAt)
      const referenceNumber = String(Math.floor(10000 + Math.random() * 90000))

      const fileExt = invoiceFile.name.split('.').pop() || 'jpg'
      const filePath = `invoices/${brandSlug}/${Date.now()}-${referenceNumber}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from(invoicesBucket)
        .upload(filePath, invoiceFile, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const invoicePublicUrl = await buildInvoiceAccessUrl(filePath)

      const submissionPayload = {
        full_name: personalDetails.fullName,
        id_number: personalDetails.idNumber,
        phone: personalDetails.phone,
        email: personalDetails.email,
        birth_date: personalDetails.birthDate,
        accepted_terms: sessionStorage.getItem('acceptedTerms') === 'true',
        answers,
        elapsed_seconds: elapsedMmSs,
        created_at: createdAt.toISOString(),
        created_at_display: createdAtFormatted,
        reference_number: referenceNumber,
        invoice_storage_path: filePath,
        invoice_public_url: invoicePublicUrl,
        ...(personal.showNetworkSelect && personalDetails.network
          ? { network: personalDetails.network }
          : {}),
      }

      const { error: insertError } = await supabase.from(submissionsTable).insert([submissionPayload])
      if (insertError) throw insertError

      sessionStorage.setItem('submissionRefNumber', referenceNumber)
      sessionStorage.setItem('invoicePublicUrl', invoicePublicUrl)
      sessionStorage.setItem('invoiceStoragePath', filePath)

      navigate('../confirmation')
    } catch (error) {
      setErrorMessage(error?.message || 'שמירת הטופס נכשלה, נסו שוב')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="invoice-page" dir="rtl">
      <section className="invoice-card">
        <div className="invoice-scroll">
          <header
            className={`invoice-header${brand.slug === 'superpharm' ? ' is-superpharm' : brand.slug === 'ramilevygoodpharm' ? ' is-rami-good-pharm' : brand.slug === 'yochananof' ? ' is-yochananof' : ''}`}
          >
            <img
              className="invoice-header-logo"
              src={logo}
              alt={`לוגו מבצע ${campaignName}`}
            />
            {brand.slug === 'superpharm' ? (
              <span className="invoice-header-brand-stack" aria-hidden="true" />
            ) : brand.slug === 'ramilevygoodpharm' ? (
              <span className="invoice-header-brand-stack invoice-header-brand-stack--rami" aria-hidden="true" />
            ) : brand.slug === 'yochananof' ? (
              <span className="invoice-header-brand-stack invoice-header-brand-stack--yochananof" aria-hidden="true" />
            ) : null}
          </header>

          <div className="invoice-content">
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
                <li className="stepper-item is-active">
                  <span className="stepper-circle">3</span>
                  <span className="stepper-label">צילום חשבונית</span>
                </li>
              </ol>
            </nav>

            <h1 className="invoice-title">העלאת חשבונית</h1>

            <section className="invoice-upload-box" aria-label="אזור העלאת חשבונית">
              <img className="invoice-upload-icon" src={uploadIcon} alt="" aria-hidden="true" />
              <h2 className="invoice-upload-heading">העלו את צילום החשבונית</h2>
              <p className="invoice-upload-subtext">ודאו שהחשבונית ברורה וקריאה</p>
              <button type="button" className="invoice-upload-button" onClick={onPickInvoice}>
                <img className="invoice-upload-button-icon" src={cameraIcon} alt="" aria-hidden="true" />
                {invoiceFile ? 'החלפת קובץ' : 'צילום או בחירת קובץ'}
              </button>
              <input
                ref={galleryInputRef}
                className="invoice-file-input"
                type="file"
                accept="image/*"
                onChange={onFileChange}
              />
              <input
                ref={cameraInputRef}
                className="invoice-file-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onFileChange}
              />
              <input
                ref={fileInputRef}
                className="invoice-file-input"
                type="file"
                accept="image/*,application/pdf"
                onChange={onFileChange}
              />
              {invoiceFile && <p className="invoice-file-name">{invoiceFile.name}</p>}
              {errorMessage && <p className="invoice-error">{errorMessage}</p>}
            </section>

            <div className="invoice-actions">
              <button type="button" className="invoice-cta" onClick={handleFinish} disabled={isSubmitting}>
                {isSubmitting ? 'שולח...' : 'סיום'}
              </button>
            </div>

            <footer className="invoice-footer-brand">
              <img src={playgroundLogo} alt="Playground" className="invoice-playground-logo" />
            </footer>
          </div>
        </div>
      </section>
      {isPickerOpen &&
        createPortal(
          <div className="invoice-picker-root" role="dialog" aria-modal="true" aria-label="בחירת מקור לחשבונית">
            <div className="invoice-picker-backdrop" role="presentation" onClick={() => setIsPickerOpen(false)} />
            <div className="invoice-picker-panel" dir="rtl">
              <button type="button" className="invoice-picker-option" onClick={pickFromGallery}>
                Photo Library
              </button>
              <button type="button" className="invoice-picker-option" onClick={pickFromCamera}>
                Take Photo
              </button>
              <button type="button" className="invoice-picker-option" onClick={pickFromFiles}>
                Choose File
              </button>
              <button type="button" className="invoice-picker-cancel" onClick={() => setIsPickerOpen(false)}>
                ביטול
              </button>
            </div>
          </div>,
          document.body,
        )}
    </main>
  )
}

