import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { upcomingAppointments } from '../data/appointments'
import type { Appointment } from '../data/appointments'

interface AppointmentsState {
  appointments: Appointment[]
  currentScreen: 'list' | 'booking' | 'confirmation'
  lastBookedAppointment: Appointment | null
}

const initialState: AppointmentsState = {
  appointments: upcomingAppointments,
  currentScreen: 'list',
  lastBookedAppointment: null
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload)
    },
    setScreen: (state, action: PayloadAction<'list' | 'booking' | 'confirmation'>) => {
      state.currentScreen = action.payload
    },
    setLastBookedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.lastBookedAppointment = action.payload
    }
  }
})

export const { addAppointment, setScreen, setLastBookedAppointment } = appointmentsSlice.actions
export default appointmentsSlice.reducer

