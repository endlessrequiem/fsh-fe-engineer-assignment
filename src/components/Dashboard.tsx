import * as React from "react";

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { deleteAppointment } from '../store/appointmentsSlice'
import Header from './Header'
import {formatDate, formatTime} from "../consts/date.ts"
import ConfirmationDialog from './ConfirmationDialog.tsx'
import {Eyeglass} from "./svg/Eyeglass.tsx";
import type {Appointment} from "../types/appointment.ts";
import { useGetAppointments } from "../consts/appointments.ts";

function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [expandedAppointmentId, setExpandedAppointmentId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean; appointmentId: string | null; providerName: string }>({
    isOpen: false,
    appointmentId: null,
    providerName: ''
  })
  const {upcomingAppointments, pastAppointments} = useGetAppointments(searchQuery);

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
      providerName: appointment.trainer.name,
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
    navigate(`/booking/${appointment.id}`)
  }

  return (
    <div className="dashboard-page">
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <button
            className="book-appointment-button"
            onClick={() => navigate('/booking')}
          >
            Book New Appointment
          </button>
        </div>
        <div className="dashboard-search">
          <div className="search-input-wrapper">
            <Eyeglass />
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
                const trainer = appointment.trainer.name
                const isExpanded = expandedAppointmentId === appointment.id
                return (
                  <div
                    key={appointment.id}
                    className={`appointment-card ${isExpanded ? 'expanded' : ''}`}
                    onClick={(e) => handleAppointmentClick(appointment, e)}
                  >
                    <div className="appointment-card-main">
                      {appointment.trainer?.imageUrl && (
                        <div className="appointment-card-image">
                          <img src={appointment.trainer?.imageUrl} alt={appointment.trainer.name} />
                        </div>
                      )}
                      <div className="appointment-card-content">
                        <h3 className="appointment-card-name">{appointment.trainer.name}</h3>
                        {trainer && (
                          <p className="appointment-card-specialization">{appointment.trainer.specialization}</p>
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
                const trainer = appointment.trainer.name
                return (
                  <div
                    key={appointment.id}
                    className="appointment-card past-appointment"
                    onClick={(e) => handleAppointmentClick(appointment, e)}
                  >
                    <div className="appointment-card-main">
                      {appointment.trainer?.imageUrl && (
                        <div className="appointment-card-image">
                          <img src={appointment.trainer.imageUrl} alt={appointment.trainer.name} />
                        </div>
                      )}
                      <div className="appointment-card-content">
                        <h3 className="appointment-card-name">{appointment.trainer.name}</h3>
                        {trainer && (
                          <p className="appointment-card-specialization">{appointment.trainer.specialization}</p>
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
      <ConfirmationDialog
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        closeText={"Go Back"}
        closeStyling={"delete-confirmation-cancel-button"}
        onAction={handleDeleteConfirm}
        actionText={"Cancel Appointment"}
        actionStyling={"delete-confirmation-delete-button"}
        dialogText={`Are you sure you want to cancel your appointment with ${deleteConfirmation.providerName}?`}
      />
    </div>
  )
}

export default Dashboard

