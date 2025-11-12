import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '../store/store'
import { setScreen } from '../store/appointmentsSlice'
import { parseAppointmentDateTime } from '../data/appointments'

function AppointmentsList() {
  const dispatch = useDispatch()
  const appointments = useSelector((state: RootState) => state.appointments.appointments)
  
  const now = new Date()
  const futureAppointments = appointments
    .filter((appointment) => {
      const appointmentDateTime = parseAppointmentDateTime(appointment.date, appointment.time)
      return appointmentDateTime.getTime() > now.getTime()
    })
    .sort((a, b) => {
      const dateA = parseAppointmentDateTime(a.date, a.time)
      const dateB = parseAppointmentDateTime(b.date, b.time)
      return dateA.getTime() - dateB.getTime()
    })

  return (
    <div>
      <h1>Upcoming Appointments</h1>
      <ul>
        {futureAppointments.map((appointment) => (
          <li key={appointment.id}>
            <div>
              <span>Provider: {appointment.providerName}</span>
              <span>Date: {appointment.date}</span>
              <span> Time: {appointment.time}</span>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => dispatch(setScreen('booking'))}>Book New Appointment</button>
    </div>
  )
}

export default AppointmentsList

