import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { setScreen, deleteAppointment, setEditingAppointment } from '../store/appointmentsSlice'
import {futureAppointments, parseAppointmentDateTime} from '../data/appointments'
import { trainers } from '../data/trainers'
import Header from './Header'
import type { Appointment } from '../data/appointments'
import {formatDate} from "../consts/date.ts"
import DeleteConfirmationDialog from './DeleteConfirmationDialog'

function Dashboard() {
  const dispatch = useDispatch()
  const now = new Date()
  const appointments = useSelector((state: RootState) => state.appointments.appointments)
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; appointmentId: string | null; providerName: string }>({
    isOpen: false,
    appointmentId: null,
    providerName: ''
  })

  const formatTime = (timeString: string): string => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    return `${hour}:${minutes}${period.toLowerCase()} (PT)`
  }

  const filterAppointmentsBySearch = (appointmentList: Appointment[]): Appointment[] => {
    if (!searchQuery.trim()) {
      return appointmentList
    }

    const query = searchQuery.toLowerCase().trim()
    return appointmentList.filter((appointment) => {
      const providerName = appointment.providerName.toLowerCase()
      const date = formatDate(appointment.date).toLowerCase()
      const time = formatTime(appointment.time).toLowerCase()
      const trainer = trainers.find(t => t.name === appointment.providerName)
      const specialization = trainer?.specialization.toLowerCase() || ''

      return (
        providerName.includes(query) ||
        date.includes(query) ||
        time.includes(query) ||
        specialization.includes(query)
      )
    })
  }

  const allUpcomingAppointments = futureAppointments(appointments)
  const upcomingAppointments = filterAppointmentsBySearch(allUpcomingAppointments)

  const allPastAppointments = appointments
    .filter((appointment) => {
      const appointmentDateTime = parseAppointmentDateTime(appointment.date, appointment.time)
      return appointmentDateTime.getTime() <= now.getTime()
    })
    .sort((a, b) => {
      const dateA = parseAppointmentDateTime(a.date, a.time)
      const dateB = parseAppointmentDateTime(b.date, b.time)
      return dateB.getTime() - dateA.getTime()
    })

  const pastAppointments = filterAppointmentsBySearch(allPastAppointments)

  const handleAppointmentClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    if (expandedAppointmentId === appointment.id) {
      setExpandedAppointmentId(null)
    } else {
      setExpandedAppointmentId(appointment.id)
    }
  }

  const handleCancelClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmation({
      isOpen: true,
      appointmentId: appointment.id,
      providerName: appointment.providerName
    })
  }

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.appointmentId) {
      dispatch(deleteAppointment(deleteConfirmation.appointmentId))
      setExpandedAppointmentId(null)
      setDeleteConfirmation({ isOpen: false, appointmentId: null, providerName: '' })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({ isOpen: false, appointmentId: null, providerName: '' })
  }

  const handleEditClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(setEditingAppointment(appointment))
    dispatch(setScreen('booking'))
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
        <div className="dashboard-search">
          <div className="search-input-wrapper">
            <svg
              className="search-icon"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 19L14.65 14.65"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search appointments by provider, date, or time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                          <div className="appointment-edit-buttons">
                              <button
                                  className="edit-appointment-button"
                                  onClick={(e) => handleEditClick(appointment, e)}
                              >
                                  Edit Appointment
                              </button>
                              <button
                                  className="cancel-appointment-button"
                                  onClick={(e) => handleCancelClick(appointment, e)}
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
      <DeleteConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onDelete={handleDeleteConfirm}
        appointmentProviderName={deleteConfirmation.providerName}
      />
    </div>
  )
}

export default Dashboard

