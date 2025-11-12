import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { upcomingAppointments } from '../data/appointments'
import type { Appointment } from '../data/appointments'

interface AppointmentsState {
  appointments: Appointment[]
  currentScreen: 'dashboard' | 'list' | 'booking' | 'confirmation' | 'appointmentDetail'
  lastBookedAppointment: Appointment | null
  selectedAppointment: Appointment | null
}

const initialState: AppointmentsState = {
  appointments: upcomingAppointments,
  currentScreen: 'dashboard',
  lastBookedAppointment: null,
  selectedAppointment: null
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload)
    },
    setScreen: (state, action: PayloadAction<'dashboard' | 'list' | 'booking' | 'confirmation' | 'appointmentDetail'>) => {
      state.currentScreen = action.payload
    },
    setLastBookedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.lastBookedAppointment = action.payload
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload
    }
  }
})

export const { addAppointment, setScreen, setLastBookedAppointment, setSelectedAppointment } = appointmentsSlice.actions
export default appointmentsSlice.reducer

