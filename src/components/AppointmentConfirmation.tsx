import { useDispatch, useSelector } from 'react-redux'
import { setScreen } from '../store/appointmentsSlice'
import type { RootState } from '../store/store'
import { trainers } from '../data/trainers'
import Header from './Header'
import {CircleConfirmed} from "../assets/CircleConfirmed.tsx";
import {formatDate} from "../consts/date.ts";

function AppointmentConfirmation() {
  const dispatch = useDispatch()
  const lastBookedAppointment = useSelector((state: RootState) => state.appointments.lastBookedAppointment)

  const formatTime = (timeString: string): string => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const formattedHour = hour === 12 ? 12 : hour
    return `${formattedHour}:${minutes}${period.toLowerCase()} (PT)`
  }

  if (!lastBookedAppointment) {
    return (
      <div className="confirmation-page">
        <Header />
        <div className="confirmation-container">
          <div className="confirmation-card">
            <h1>Appointment Confirmation</h1>
            <p>No appointment found.</p>
            <button onClick={() => dispatch(setScreen('list'))}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  const trainer = trainers.find(t => t.name === lastBookedAppointment.providerName)

  return (
    <div className="confirmation-page">
      <Header />
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <CircleConfirmed />
          </div>
          <h1 className="confirmation-title">Your visit is booked.</h1>

          <div className="appointment-details-box">
            <div className="appointment-trainer-info">
              {trainer?.imageUrl && (
                <div className="appointment-trainer-image">
                  <img src={trainer.imageUrl} alt={trainer.name} />
                </div>
              )}
              <div className="appointment-trainer-details">
                <h3 className="appointment-trainer-name">{lastBookedAppointment.providerName}</h3>
                {trainer && (
                  <p className="appointment-trainer-specialization">{trainer.specialization}</p>
                )}
                  <p className="appointment-date">{formatDate(lastBookedAppointment.date)}</p>
                  <p className="appointment-time">{formatTime(lastBookedAppointment.time)}</p>
                  <p className="appointment-visit-type">50 min Zoom Visit</p>
              </div>
            </div>
          </div>

          <div className="confirmation-buttons">
            <button
              className="back-to-dashboard-button"
              onClick={() => dispatch(setScreen('dashboard'))}
            >
              Back to Dashboard
            </button>
            <button
              className="add-to-calendar-button"
              onClick={() => {
                // Add to calendar functionality can be implemented here
                console.log('Add to calendar')
              }}
            >
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppointmentConfirmation

