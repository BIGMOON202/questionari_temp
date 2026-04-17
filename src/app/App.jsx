import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/home/HomePage.jsx'
import { PersonalDetailsPage } from '../pages/personal/PersonalDetailsPage.jsx'
import { QuestionsPage } from '../pages/questions/QuestionsPage.jsx'
import { InvoicePage } from '../pages/invoice/InvoicePage.jsx'
import { ConfirmationPage } from '../pages/confirmation/ConfirmationPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/personal" element={<PersonalDetailsPage />} />
        <Route path="/questions" element={<QuestionsPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
