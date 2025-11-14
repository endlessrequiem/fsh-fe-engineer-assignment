
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString + 'T00:00:00')
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const dayName = days[date.getDay()]
    const month = months[date.getMonth()]
    const day = String(date.getDate()).padStart(2, '0')
    const year = date.getFullYear()

    return `${dayName}, ${month} ${day}, ${year}`
}

//Takes in a Date object, rather than a string, used for storage and filtering
export const formatDateToString = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export const formatTime = (timeString: string): string => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const formattedHour = hour === 12 ? 12 : hour
    return `${formattedHour}:${minutes}${period.toLowerCase()} (PT)`
}

export const isToday = (date: Date): boolean => {
    const today = new Date()
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    )
}

export const parseTimeToDate = (timeString: string, date: Date): Date => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':').map(Number)

    let hour24 = hours
    if (period === 'PM' && hours !== 12) {
        hour24 = hours + 12
    } else if (period === 'AM' && hours === 12) {
        hour24 = 0
    }

    const timeDate = new Date(date)
    timeDate.setHours(hour24, minutes, 0, 0)
    return timeDate
}
