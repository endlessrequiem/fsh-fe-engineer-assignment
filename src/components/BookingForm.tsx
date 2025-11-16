import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import type { RootState } from '../store/store'
import { addAppointment, updateAppointment } from '../store/appointmentsSlice'
import { trainers } from '../data/trainers'
import Calendar from './Calendar'
import Header from './Header'
import {getAvailableTimeSlotsForTrainer, parseAppointmentDateTime} from "../consts/appointments.ts";
import type {Appointment} from "../types/appointment.ts";
import {formatDateToString, isToday, parseTimeToDate} from "../consts/date.ts";

function BookingForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { appointmentId } = useParams<{ appointmentId?: string }>()
  const existingAppointments = useSelector((state: RootState) => state.appointments.appointments)

  const editingAppointment = useMemo(() => {
    return appointmentId
      ? existingAppointments.find(apt => apt.id === appointmentId) || null
      : null
  }, [appointmentId, existingAppointments])

  // Compute initial values based on editingAppointment
  const initialValues = useMemo(() => {
    if (editingAppointment) {
      const appointmentDate = parseAppointmentDateTime(editingAppointment.date, editingAppointment.time)
      const trainer = trainers.find(t => t.name === editingAppointment.trainer.name)

      return {
        date: appointmentDate,
        trainerId: trainer?.id || '',
        time: editingAppointment.time
      }
    }
    return {
      date: null as Date | null,
      trainerId: '',
      time: ''
    }
  }, [editingAppointment])

  const [selectedDate, setSelectedDate] = useState<Date | null>(() => initialValues.date)
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>(() => initialValues.trainerId)
  const [selectedTime, setSelectedTime] = useState<string>(() => initialValues.time)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleBookVisit = () => {
    if (!selectedDate || !selectedTrainerId || !selectedTime) {
      return
    }

    const selectedTrainer = trainers.find(t => t.id === selectedTrainerId)
    if (!selectedTrainer) return

    if (editingAppointment) {
      const updatedAppointment: Appointment = {
        id: editingAppointment.id,
        trainer: selectedTrainer,
        date: formatDateToString(selectedDate),
        time: selectedTime
      }
      dispatch(updateAppointment(updatedAppointment))
      navigate('/confirmation', { state: { appointment: updatedAppointment } })
    } else {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        trainer: selectedTrainer,
        date: formatDateToString(selectedDate),
        time: selectedTime
      }
      dispatch(addAppointment(newAppointment))
      navigate('/confirmation', { state: { appointment: newAppointment } })
    }
  }

  const filterAvailableTimeSlots = (timeSlots: string[], date: Date): string[] => {
    const dateString = formatDateToString(date)
    const now = new Date()

    return timeSlots.filter((time) => {
      // Filter out past times if it's today
      if (isToday(date)) {
        const timeDate = parseTimeToDate(time, date)
        if (timeDate <= now) {
          return false
        }
      }

      // Filter out times that are already booked for any trainer on this date
      const hasConflict = existingAppointments.some((appointment) => {
        // Skip the appointment we're currently editing (allow keeping the same time)
        if (editingAppointment && appointment.id === editingAppointment.id) {
          return false
        }

        // Check if any appointment exists for the same date and time (regardless of trainer)
        return (
          appointment.date === dateString &&
          appointment.time === time
        )
      })

      return !hasConflict
    })
  }

  const canBook = selectedDate && selectedTrainerId && selectedTime

  return (
    <div className="booking-page">
      <Header />
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">{editingAppointment ? 'Edit Appointment' : 'Book a visit'}</h1>
          <p className="booking-subtitle">Choose a date to see available times.</p>
        </div>

        <div className="booking-content">
          <div className="booking-left">
            <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          </div>

          <div className="booking-right">
            {(editingAppointment
              ? trainers.filter(trainer => trainer === editingAppointment.trainer)
              : trainers
            ).map((trainer) => {
              const allTimeSlots = selectedDate
                ? getAvailableTimeSlotsForTrainer()
                : []

              const trainerTimeSlots = selectedDate
                ? filterAvailableTimeSlots(allTimeSlots, selectedDate)
                : []

              return (
                <div key={trainer.id} className="trainer-card">
                  <div className="trainer-info">
                    <div className="trainer-image">
                      {trainer.imageUrl ? (
                        <img src={trainer.imageUrl} alt={trainer.name} />
                      ) : (
                        <div className="trainer-placeholder">{trainer.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="trainer-details">
                      <h3 className="trainer-name">{trainer.name}</h3>
                      <p className="trainer-specialization">{trainer.specialization}</p>
                    </div>
                  </div>
                  {selectedDate && (
                    <div className="time-slots">
                      {trainerTimeSlots.length > 0 ? (
                        trainerTimeSlots.map((time) => {
                          const isSelected = selectedTrainerId === trainer.id && selectedTime === time
                          return (
                            <button
                              key={time}
                              type="button"
                              className={`time-slot-button ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setSelectedTrainerId(trainer.id)
                                setSelectedTime(time)
                              }}
                            >
                              {time}
                            </button>

                          )
                        })
                      ) : (
                        <p className="no-slots">No available times for this date</p>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <div className="booking-footer">
          <div className="footer-left">
            <p className="help-text">
              Need help scheduling? <a href="#" className="help-link">Contact us</a>
            </p>
          </div>
          <div className="footer-right">
            <button
              type="button"
              className={`book-button ${!canBook ? 'disabled' : ''}`}
              onClick={handleBookVisit}
              disabled={!canBook}
            >
              {editingAppointment ? 'Update Appointment' : 'Book this visit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm

