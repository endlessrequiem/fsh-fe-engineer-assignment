import {type Trainer, trainers} from "./trainers.ts";

export type Appointment = {
    id: string
    trainer: Trainer
    date: string
    time: string
}

export const upcomingAppointments: Appointment[] = [
    {
        id: '1',
        trainer: trainers[0],
        date: '2026-01-16',
        time: '10:00 AM'
    },
    {
        id: '2',
        trainer: trainers[1],
        date: '2026-01-16',
        time: '2:00 PM'
    },
    {
        id: '3',
        trainer: trainers[2],
        date: '2026-01-17',
        time: '9:00 AM'
    },
    {
        id: '4',
        trainer: trainers[2],
        date: '2025-11-10',
        time: '9:00 AM'
    },
    {
        id: '5',
        trainer: trainers[1],
        date: '2025-11-11',
        time: '9:00 AM'
    },

]

export function futureAppointments(appointments: Appointment[]) {
    const now = new Date()

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

