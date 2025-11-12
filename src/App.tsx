import './App.css'
import { useSelector } from 'react-redux'
import type { RootState } from './store/store'
import AppointmentsList from './components/AppointmentsList'
import BookingForm from './components/BookingForm'
import AppointmentConfirmation from './components/AppointmentConfirmation'

function App() {
  const currentScreen = useSelector((state: RootState) => state.appointments.currentScreen)

  return (
    <>
      {currentScreen === 'list' && <AppointmentsList />}
      {currentScreen === 'booking' && <BookingForm />}
      {currentScreen === 'confirmation' && <AppointmentConfirmation />}
    </>
  )
}

export default App
