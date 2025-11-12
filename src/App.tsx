import './App.css'
import {futureAppointments} from "./data/appointments.ts";

function App() {


  return (
    <>
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
      </div>
    </>
  )
}

export default App
