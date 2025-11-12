import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { setScreen } from '../store/appointmentsSlice'
import {futureAppointments, parseAppointmentDateTime} from '../data/appointments'
import { trainers } from '../data/trainers'
import Header from './Header'
import type { Appointment } from '../data/appointments'
import {formatDate} from "../consts/date.ts";

function Dashboard() {
  const dispatch = useDispatch()
  const now = new Date()
  const appointments = useSelector((state: RootState) => state.appointments.appointments)
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null)


  const upcomingAppointments = futureAppointments(appointments)

  const pastAppointments = appointments
    .filter((appointment) => {
      const appointmentDateTime = parseAppointmentDateTime(appointment.date, appointment.time)
      return appointmentDateTime.getTime() <= now.getTime()
    })
    .sort((a, b) => {
      const dateA = parseAppointmentDateTime(a.date, a.time)
      const dateB = parseAppointmentDateTime(b.date, b.time)
      return dateB.getTime() - dateA.getTime()
    })

  const formatTime = (timeString: string): string => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    return `${hour}:${minutes}${period.toLowerCase()} (PT)`
  }

  const handleAppointmentClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    if (expandedAppointmentId === appointment.id) {
      setExpandedAppointmentId(null)
    } else {
      setExpandedAppointmentId(appointment.id)
    }
  }

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button
            className="book-appointment-button"
            onClick={() => dispatch(setScreen('booking'))}
          >
            Book New Appointment
          </button>
        </div>
        <div className="appointments-section">
          <h2 className="section-title">Upcoming Appointments</h2>
          {upcomingAppointments.length === 0 ? (
            <p className="no-appointments">No upcoming appointments</p>
          ) : (
            <div className="appointments-grid">
              {upcomingAppointments.map((appointment) => {
                const trainer = trainers.find(t => t.name === appointment.providerName)
                const isExpanded = expandedAppointmentId === appointment.id
                return (
                  <div
                    key={appointment.id}
                    className={`appointment-card ${isExpanded ? 'expanded' : ''}`}
                    onClick={(e) => handleAppointmentClick(appointment, e)}
                  >
                    <div className="appointment-card-main">
                      {trainer?.imageUrl && (
                        <div className="appointment-card-image">
                          <img src={trainer.imageUrl} alt={trainer.name} />
                        </div>
                      )}
                      <div className="appointment-card-content">
                        <h3 className="appointment-card-name">{appointment.providerName}</h3>
                        {trainer && (
                          <p className="appointment-card-specialization">{trainer.specialization}</p>
                        )}
                        <p className="appointment-card-date">{formatDate(appointment.date)}</p>
                        <p className="appointment-card-time">{formatTime(appointment.time)}</p>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="appointment-card-expanded" onClick={(e) => e.stopPropagation()}>
                          <div className="confirmation-buttons">
                              <button
                                  className="edit-appointment-button"
                                  onClick={(e) => {
                                      e.stopPropagation()
                                      //todo
                                  }}
                              >
                                  Edit Appointment
                              </button>
                              <button
                                  className="cancel-appointment-button"
                                  onClick={(e) => {
                                      e.stopPropagation()
                                  }}
                              >
                                  Cancel Appointment
                              </button>
                          </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="appointments-section">
          <h2 className="section-title">Past Appointments</h2>
          {pastAppointments.length === 0 ? (
            <p className="no-appointments">No previous appointments</p>
          ) : (
            <div className="appointments-grid">
              {pastAppointments.map((appointment) => {
                const trainer = trainers.find(t => t.name === appointment.providerName)
                return (
                  <div
                    key={appointment.id}
                    className="appointment-card past-appointment"
                    onClick={(e) => handleAppointmentClick(appointment, e)}
                  >
                    <div className="appointment-card-main">
                      {trainer?.imageUrl && (
                        <div className="appointment-card-image">
                          <img src={trainer.imageUrl} alt={trainer.name} />
                        </div>
                      )}
                      <div className="appointment-card-content">
                        <h3 className="appointment-card-name">{appointment.providerName}</h3>
                        {trainer && (
                          <p className="appointment-card-specialization">{trainer.specialization}</p>
                        )}
                        <p className="appointment-card-date">{formatDate(appointment.date)}</p>
                        <p className="appointment-card-time">{formatTime(appointment.time)}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

