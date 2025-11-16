import './App.css'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import BookingForm from './components/BookingForm'
import AppointmentConfirmation from './components/AppointmentConfirmation.tsx'

// Wrapper component to provide key based on appointmentId for proper remounting
function BookingFormWrapper() {
  const { appointmentId } = useParams<{ appointmentId?: string }>()
  return <BookingForm key={appointmentId || 'new'} />
}

function App() {
  // Use Vite's BASE_URL which automatically handles the base path
  // In production: '/fsh-fe-engineer-assignment' (for GitHub Pages)
  // In development: '/' (root path for easier local testing)
  // Remove trailing slash to match React Router's basename format
  const basename = import.meta.env.BASE_URL !== '/'
    ? import.meta.env.BASE_URL.replace(/\/$/, '')
    : undefined

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/booking/:appointmentId"
          element={<BookingFormWrapper />}
        />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/confirmation" element={<AppointmentConfirmation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
