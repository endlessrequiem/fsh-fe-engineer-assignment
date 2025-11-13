export type Trainer = {
  id: string
  name: string
  specialization?: string
  imageUrl?: string
}

export const trainers: Trainer[] = [
  {
    id: '1',
    name: 'Nicole Smith',
    specialization: 'Personal Trainer - Strength & Conditioning',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'John Brown',
    specialization: 'Personal Trainer - Weight Loss & Wellness',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Emily Davis',
    specialization: 'Personal Trainer - Functional Fitness & Mobility',
    imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
  }
]

export const getAvailableTimeSlotsForTrainer = (): string[] => {
    return [
      '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
  ]
}

