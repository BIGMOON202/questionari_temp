import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes, useParams } from 'react-router-dom'
import { getBrandBySlug } from '../config/brands.js'
import { BrandContext } from '../context/BrandContext.jsx'
import { HomePage } from '../pages/home/HomePage.jsx'
import { PersonalDetailsPage } from '../pages/personal/PersonalDetailsPage.jsx'
import { QuestionsPage } from '../pages/questions/QuestionsPage.jsx'
import { InvoicePage } from '../pages/invoice/InvoicePage.jsx'
import { ConfirmationPage } from '../pages/confirmation/ConfirmationPage.jsx'
import soadClearLogo from '../assets/images/Soad_Clear_logo.png'

function BrandLayout() {
  const { brand: brandSlug } = useParams()
  const brand = getBrandBySlug(brandSlug ?? '')
  if (!brand) {
    return <Navigate to="/superpharm" replace />
  }

  useEffect(() => {
    const titlesByBrand = {
      superpharm: 'Superpharm',
      ramilevygoodpharm: 'Ramilevy Goodpharm',
      yochananof: 'Yochananof',
    }
    document.title = titlesByBrand[brand.slug] ?? 'Superpharm'

    let iconLink = document.querySelector("link[rel='icon']")
    if (!iconLink) {
      iconLink = document.createElement('link')
      iconLink.setAttribute('rel', 'icon')
      document.head.appendChild(iconLink)
    }
    iconLink.setAttribute('type', 'image/png')
    iconLink.setAttribute('href', soadClearLogo)
  }, [brand.slug])

  return (
    <BrandContext.Provider value={brand}>
      <Outlet />
    </BrandContext.Provider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/superpharm" replace />} />
        <Route path="/:brand" element={<BrandLayout />}>
          <Route index element={<HomePage />} />
          <Route path="personal" element={<PersonalDetailsPage />} />
          <Route path="questions" element={<QuestionsPage />} />
          <Route path="invoice" element={<InvoicePage />} />
          <Route path="confirmation" element={<ConfirmationPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/superpharm" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
