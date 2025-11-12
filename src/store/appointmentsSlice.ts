import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { upcomingAppointments } from '../data/appointments'
import type { Appointment } from '../data/appointments'

interface AppointmentsState {
  appointments: Appointment[]
  currentScreen: 'dashboard' | 'list' | 'booking' | 'confirmation' | 'appointmentDetail'
  lastBookedAppointment: Appointment | null
  selectedAppointment: Appointment | null
  editingAppointment: Appointment | null
}

const initialState: AppointmentsState = {
  appointments: upcomingAppointments,
  currentScreen: 'dashboard',
  lastBookedAppointment: null,
  selectedAppointment: null,
  editingAppointment: null
}

const appointmentsSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload)
    },
    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload)
    },
    setScreen: (state, action: PayloadAction<'dashboard' | 'list' | 'booking' | 'confirmation' | 'appointmentDetail'>) => {
      state.currentScreen = action.payload
    },
    setLastBookedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.lastBookedAppointment = action.payload
    },
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload
    },
    setEditingAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.editingAppointment = action.payload
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(apt => apt.id === action.payload.id)
      if (index !== -1) {
        state.appointments[index] = action.payload
      }
    }
  }
})

export const { addAppointment, deleteAppointment, updateAppointment, setScreen, setLastBookedAppointment, setSelectedAppointment, setEditingAppointment } = appointmentsSlice.actions
export default appointmentsSlice.reducer

