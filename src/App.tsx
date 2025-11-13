import './App.css'
import { useSelector } from 'react-redux'
import type { RootState } from './store/store'
import Dashboard from './components/Dashboard'
import BookingForm from './components/BookingForm'
import AppointmentConfirmation from './components/AppointmentConfirmation.tsx'

function App() {
  const currentScreen = useSelector((state: RootState) => state.appointments.currentScreen)
  const editingAppointment = useSelector((state: RootState) => state.appointments.editingAppointment)

  return (
    <>
      {currentScreen === 'dashboard' && <Dashboard />}
      {currentScreen === 'booking' && <BookingForm key={editingAppointment?.id || 'new'} />}
      {currentScreen === 'confirmation' && <AppointmentConfirmation />}
    </>
  )
}

export default App
