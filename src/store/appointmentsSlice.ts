import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { upcomingAppointments } from '../data/appointments'
import type { Appointment } from '../types/appointment'

interface AppointmentsState {
  appointments: Appointment[]
}

const initialState: AppointmentsState = {
  appointments: upcomingAppointments
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload)
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter((appointment: Appointment) => appointment.id !== action.payload)
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex((apt: Appointment) => apt.id === action.payload.id)
      if (index !== -1) {
        state.appointments[index] = action.payload
      }
    }
  }
})

export const { addAppointment, deleteAppointment, updateAppointment } = appointmentsSlice.actions
export default appointmentsSlice.reducer

