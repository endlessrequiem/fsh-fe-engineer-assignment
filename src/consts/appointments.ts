import {formatDate, formatTime} from "./date.ts";
import type {Appointment} from "../types/appointment.ts";

const now = new Date()

export const futureAppointments = (appointments: Appointment[]) => {
    return appointments.filter((appointment) => {
        const appointmentDateTime = parseAppointmentDateTime(appointment.date, appointment.time)
        return appointmentDateTime.getTime() > now.getTime()
    })
        .sort((a, b) => {
            const dateA = parseAppointmentDateTime(a.date, a.time)
            const dateB = parseAppointmentDateTime(b.date, b.time)
            return dateA.getTime() - dateB.getTime()
        })
}


export const parseAppointmentDateTime = (date: string, time: string): Date => {
    const [year, month, day] = date.split('-').map(Number)
    const [timePart, period] = time.split(' ')
    const [hours, minutes] = timePart.split(':').map(Number)

    let hour24 = hours
    if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
        hour24 = 0
    }

    return new Date(year, month - 1, day, hour24, minutes)
}

export const filterAppointmentsBySearch = (appointmentList: Appointment[], searchQuery: string): Appointment[] => {
    if (!searchQuery.trim()) {
        return appointmentList
    }

    const query = searchQuery.toLowerCase().trim()
    return appointmentList.filter((appointment) => {
        const trainer = appointment.trainer.name
        const providerName = trainer.toLowerCase()
        const date = formatDate(appointment.date).toLowerCase()
        const time = formatTime(appointment.time).toLowerCase()
        const specialization = appointment.trainer.specialization.toLowerCase()

        return (
            providerName.includes(query) ||
            date.includes(query) ||
            time.includes(query) ||
            specialization.includes(query)
        )
    })
}

export const allPastAppointments = (appointments: Appointment[]) => appointments
    .filter((appointment) => {
        const appointmentDateTime = parseAppointmentDateTime(appointment.date, appointment.time)
        return appointmentDateTime.getTime() <= now.getTime()
    })
    .sort((a, b) => {
        const dateA = parseAppointmentDateTime(a.date, a.time)
        const dateB = parseAppointmentDateTime(b.date, b.time)
        return dateB.getTime() - dateA.getTime()
    })

export const getAvailableTimeSlotsForTrainer = (): string[] => {
    return [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    ]
}


