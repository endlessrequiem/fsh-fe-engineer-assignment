import { useDispatch, useSelector } from 'react-redux'
import { setScreen, setEditingAppointment } from '../store/appointmentsSlice.ts'
import type { RootState } from '../store/store.ts'
import Header from './Header.tsx'
import {CircleConfirmed} from "./svg/CircleConfirmed.tsx";
import {formatDate, formatTime} from "../consts/date.ts";

function AppointmentConfirmation() {
  const dispatch = useDispatch()
  const lastBookedAppointment = useSelector((state: RootState) => state.appointments.lastBookedAppointment)

  //If the selector were to fail in retrieving the appointment that was just booked, we would need to inform the user
  if (!lastBookedAppointment) {
    return (
      <div className="confirmation-page">
        <Header />
        <div className="confirmation-container">
          <div className="confirmation-card">
            <h1>Appointment Booking Failed</h1>
            <p>Try again, contact support if this issue persists.</p>
            <button onClick={() => dispatch(setScreen('dashboard'))}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    )
  }

  const trainer = lastBookedAppointment.trainer

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
                <h3 className="appointment-trainer-name">{lastBookedAppointment.trainer.name}</h3>
                {trainer?.specialization && (
                  <p className="appointment-trainer-specialization">{trainer.specialization}</p>
                )}
                  <p className="appointment-date">{formatDate(lastBookedAppointment.date)}</p>
                  <p className="appointment-time">{formatTime(lastBookedAppointment.time)}</p>
                  <p className="appointment-visit-type">50 min Zoom Visit</p>
              </div>
            </div>
          </div>

          <div className="appointment-edit-buttons">
            <button
              className="back-to-dashboard-button"
              onClick={() => {
                dispatch(setEditingAppointment(null))
                dispatch(setScreen('dashboard'))
              }}
            >
              Back to Dashboard
            </button>
            <button
              className="add-to-calendar-button"
              onClick={() => {
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

