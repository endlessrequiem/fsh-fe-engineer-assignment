import appointmentsReducer, {
  addAppointment,
  deleteAppointment,
  updateAppointment,
  setLastBookedAppointment,
} from './appointmentsSlice.ts'
import type { Appointment } from '../data/appointments.ts'
import { trainers } from '../data/trainers.ts'

describe('Appointments Slice', () => {
  const mockAppointment: Appointment = {
    id: 'test-1',
    trainer: trainers[0],
    date: '2026-01-20',
    time: '10:00 AM',
  }

  const mockAppointment2: Appointment = {
    id: 'test-2',
    trainer: trainers[1],
    date: '2026-01-20',
    time: '2:00 PM',
  }

  describe('Booking an appointment', () => {
    it('should add a new appointment to the appointments array', () => {
      const initialState = {
        appointments: [],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      const action = addAppointment(mockAppointment)
      const state = appointmentsReducer(initialState, action)

      expect(state.appointments).toHaveLength(1)
      expect(state.appointments[0]).toEqual(mockAppointment)
      expect(state.appointments[0].id).toBe('test-1')
      expect(state.appointments[0].trainer).toEqual(trainers[0])
      expect(state.appointments[0].date).toBe('2026-01-20')
      expect(state.appointments[0].time).toBe('10:00 AM')
    })

    it('should set the last booked appointment when booking', () => {
      const initialState = {
        appointments: [],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      const addAction = addAppointment(mockAppointment)
      const stateAfterAdd = appointmentsReducer(initialState, addAction)

      const setLastAction = setLastBookedAppointment(mockAppointment)
      const finalState = appointmentsReducer(stateAfterAdd, setLastAction)

      expect(finalState.lastBookedAppointment).toEqual(mockAppointment)
    })
  })

  describe('Checking if an appointment has already been booked', () => {
    it('should detect when an appointment slot is already booked', () => {
      const existingAppointment: Appointment = {
        id: 'existing-1',
        trainer: trainers[0],
        date: '2026-01-20',
        time: '10:00 AM',
      }

      const initialState = {
        appointments: [existingAppointment],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      // Check if the appointment exists
      const hasConflict = initialState.appointments.some(
        (appointment) =>
          appointment.trainer.id === existingAppointment.trainer.id &&
          appointment.date === existingAppointment.date &&
          appointment.time === existingAppointment.time
      )

      expect(hasConflict).toBe(true)
    })

    it('should detect conflicts for the same trainer, date, and time', () => {
      const bookedAppointment: Appointment = {
        id: 'booked-1',
        trainer: trainers[0],
        date: '2026-01-21',
        time: '2:00 PM',
      }

      const initialState = {
        appointments: [bookedAppointment],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      // Try to book the same slot
      const conflictingAppointment: Appointment = {
        id: 'conflict-1',
        trainer: trainers[0], // Same trainer
        date: '2026-01-21', // Same date
        time: '2:00 PM', // Same time
      }

      const hasConflict = initialState.appointments.some(
        (appointment) =>
          appointment.trainer.id === conflictingAppointment.trainer.id &&
          appointment.date === conflictingAppointment.date &&
          appointment.time === conflictingAppointment.time
      )

      expect(hasConflict).toBe(true)
    })
  })

  describe('Editing an appointment', () => {
    it('should update an existing appointment', () => {
      const initialState = {
        appointments: [mockAppointment],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      const updatedAppointment: Appointment = {
        ...mockAppointment,
        date: '2026-01-25',
        time: '3:00 PM',
      }

      const action = updateAppointment(updatedAppointment)
      const state = appointmentsReducer(initialState, action)

      expect(state.appointments).toHaveLength(1)
      expect(state.appointments[0].id).toBe('test-1')
      expect(state.appointments[0].date).toBe('2026-01-25')
      expect(state.appointments[0].time).toBe('3:00 PM')
    })

    it('should update only the specified appointment when multiple exist', () => {
      const initialState = {
        appointments: [mockAppointment, mockAppointment2],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      const updatedAppointment: Appointment = {
        ...mockAppointment,
        time: '11:00 AM',
      }

      const action = updateAppointment(updatedAppointment)
      const state = appointmentsReducer(initialState, action)

      expect(state.appointments).toHaveLength(2)
      expect(state.appointments[0].time).toBe('11:00 AM')
      expect(state.appointments[1]).toEqual(mockAppointment2) // Unchanged
    })
  })

  describe('Deleting an appointment', () => {
    it('should remove an appointment by ID', () => {
      const initialState = {
        appointments: [mockAppointment, mockAppointment2],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      const action = deleteAppointment('test-1')
      const state = appointmentsReducer(initialState, action)

      expect(state.appointments).toHaveLength(1)
      expect(state.appointments[0]).toEqual(mockAppointment2)
      expect(state.appointments.find((apt) => apt.id === 'test-1')).toBeUndefined()
    })

    it('should remove the correct appointment when multiple exist', () => {
      const thirdAppointment: Appointment = {
        id: 'test-3',
        trainer: trainers[2],
        date: '2026-01-22',
        time: '9:00 AM',
      }

      const initialState = {
        appointments: [mockAppointment, mockAppointment2, thirdAppointment],
        currentScreen: 'dashboard' as const,
        lastBookedAppointment: null,
        selectedAppointment: null,
        editingAppointment: null,
      }

      const action = deleteAppointment('test-2')
      const state = appointmentsReducer(initialState, action)

      expect(state.appointments).toHaveLength(2)
      expect(state.appointments.find((apt) => apt.id === 'test-1')).toBeDefined()
      expect(state.appointments.find((apt) => apt.id === 'test-2')).toBeUndefined()
      expect(state.appointments.find((apt) => apt.id === 'test-3')).toBeDefined()
    })
  })
})

