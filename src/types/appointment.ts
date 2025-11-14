import type {Trainer} from "./trainer.ts";

export type Appointment = {
    id: string
    trainer: Trainer
    date: string
    time: string
}
