import {trainers} from "./trainers.ts";
import type {Appointment} from "../types/appointment.ts";

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

];
