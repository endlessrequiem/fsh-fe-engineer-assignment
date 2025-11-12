import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addAppointment, setScreen, setLastBookedAppointment } from '../store/appointmentsSlice'
import { trainers, getAvailableTimeSlotsForTrainer } from '../data/trainers'
import type { Appointment } from '../data/appointments'
import Calendar from './Calendar'
import Header from './Header'

function BookingForm() {
  const dispatch = useDispatch()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

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

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      providerName: selectedTrainer.name,
      date: formatDateToString(selectedDate),
      time: selectedTime
    }

    dispatch(addAppointment(newAppointment))
    dispatch(setLastBookedAppointment(newAppointment))
    dispatch(setScreen('confirmation'))
  }

  const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const parseTimeToDate = (timeString: string, date: Date): Date => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':').map(Number)

    let hour24 = hours
    if (period === 'PM' && hours !== 12) {
      hour24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
      hour24 = 0
    }

    const timeDate = new Date(date)
    timeDate.setHours(hour24, minutes, 0, 0)
    return timeDate
  }

  const filterAvailableTimeSlots = (timeSlots: string[], date: Date): string[] => {
    if (!isToday(date)) {
      return timeSlots
    }

    const now = new Date()
    return timeSlots.filter((time) => {
      const timeDate = parseTimeToDate(time, date)
      return timeDate > now
    })
  }

  const canBook = selectedDate && selectedTrainerId && selectedTime

  return (
    <div className="booking-page">
      <Header />
      <div className="booking-container">
        <div className="booking-header">
          <h1 className="booking-title">Book a visit</h1>
          <p className="booking-subtitle">Choose a date to see available times.</p>
        </div>

        <div className="booking-content">
          <div className="booking-left">
            <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} />
          </div>

          <div className="booking-right">
            {trainers.map((trainer) => {
              const allTimeSlots = selectedDate
                ? getAvailableTimeSlotsForTrainer(trainer.id)
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
              Book this visit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingForm

