import { useRef, useState } from 'react'
import { storeScenarios } from '../../config/storeScenarios.js'
import { useNavigate } from 'react-router-dom'
import logoImage from '../../assets/images/logo1.png'
import playgroundLogo from '../../assets/images/playground.png'
import uploadIcon from '../../assets/images/upload_icon.png'
import cameraIcon from '../../assets/images/camera.png'
import { invoicesBucket, submissionsTable, supabase } from '../../lib/supabaseClient.js'
import './invoicePage.css'

export function InvoicePage() {
  const navigate = useNavigate()
  const activeScenario = storeScenarios.superPharm
  const [invoiceFile, setInvoiceFile] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const fileInputRef = useRef(null)

  function onPickInvoice() {
    fileInputRef.current?.click()
  }

  function onFileChange(event) {
    const selected = event.target.files?.[0] ?? null
    setInvoiceFile(selected)
    setErrorMessage('')
  }

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
      const referenceNumber = String(Math.floor(10000 + Math.random() * 90000))

      const fileExt = invoiceFile.name.split('.').pop() || 'jpg'
      const filePath = `invoices/${Date.now()}-${referenceNumber}.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from(invoicesBucket)
        .upload(filePath, invoiceFile, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: publicData } = supabase.storage.from(invoicesBucket).getPublicUrl(filePath)
      const invoicePublicUrl = publicData?.publicUrl ?? ''

      const submissionPayload = {
        full_name: personalDetails.fullName,
        id_number: personalDetails.idNumber,
        phone: personalDetails.phone,
        email: personalDetails.email,
        birth_date: personalDetails.birthDate,
        accepted_terms: sessionStorage.getItem('acceptedTerms') === 'true',
        answers,
        elapsed_seconds: elapsedSeconds,
        reference_number: referenceNumber,
        invoice_storage_path: filePath,
        invoice_public_url: invoicePublicUrl,
      }

      const { error: insertError } = await supabase.from(submissionsTable).insert([submissionPayload])
      if (insertError) throw insertError

      sessionStorage.setItem('submissionRefNumber', referenceNumber)
      sessionStorage.setItem('invoicePublicUrl', invoicePublicUrl)
      sessionStorage.setItem('invoiceStoragePath', filePath)

      navigate('/confirmation')
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
          <header className="invoice-header">
            <img
              className="invoice-header-logo"
              src={logoImage}
              alt={`לוגו מבצע ${activeScenario.campaignName}`}
            />
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
              <h2 className="invoice-upload-heading">העלו את חשבונית</h2>
              <p className="invoice-upload-subtext">ודאו שהחשבונית ברורה וקריאה</p>
              <button type="button" className="invoice-upload-button" onClick={onPickInvoice}>
                <img className="invoice-upload-button-icon" src={cameraIcon} alt="" aria-hidden="true" />
                {invoiceFile ? 'החלפת קובץ' : 'צלמו את המוצר לבד'}
              </button>
              <input
                ref={fileInputRef}
                className="invoice-file-input"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={onFileChange}
              />
              {invoiceFile && <p className="invoice-file-name">{invoiceFile.name}</p>}
              {errorMessage && <p className="invoice-error">{errorMessage}</p>}
            </section>
          </div>
        </div>

        <div className="invoice-bottom">
          <button type="button" className="invoice-cta" onClick={handleFinish} disabled={isSubmitting}>
            {isSubmitting ? 'שולח...' : 'סיום'}
          </button>
          <footer className="invoice-footer-brand">
            <img src={playgroundLogo} alt="Playground" className="invoice-playground-logo" />
          </footer>
        </div>
      </section>
    </main>
  )
}

