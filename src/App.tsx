import './App.css'
import { useSelector } from 'react-redux'
import type { RootState } from './store/store'
import Dashboard from './components/Dashboard'
import BookingForm from './components/BookingForm'
import AppointmentConfirmation from './components/AppointmentConfirmation'

function App() {
  const currentScreen = useSelector((state: RootState) => state.appointments.currentScreen)

  return (
    <>
      {currentScreen === 'dashboard' && <Dashboard />}
      {currentScreen === 'booking' && <BookingForm />}
      {currentScreen === 'confirmation' && <AppointmentConfirmation />}
    </>
  )
}

export default App
