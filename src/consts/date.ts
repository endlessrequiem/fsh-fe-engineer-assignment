
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

export const formatTime = (timeString: string): string => {
    const [time, period] = timeString.split(' ')
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const formattedHour = hour === 12 ? 12 : hour
    return `${formattedHour}:${minutes}${period.toLowerCase()} (PT)`
}
