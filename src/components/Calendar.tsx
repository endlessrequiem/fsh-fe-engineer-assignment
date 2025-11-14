import { useState } from 'react'
import {ChevronLeft} from "./svg/ChevronLeft.tsx";
import {ChevronRight} from "./svg/ChevronRight.tsx";

type CalendarProps = {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
}

function Calendar({ selectedDate, onDateSelect }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  //To make this calendar, start with a Date object, and figure out the day, month, and year
  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  //To calculate how long each month is, we figure out what the first and last day will be, how many days there, and starting day of week
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  //Set Month names and Weekdays
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  //Determine what days have passed, so that appointments cannot be made retroactively
  const isCurrentMonthOrEarlier = () => {
    const currentMonthDate = new Date(year, month, 1)
    const todayMonthDate = new Date(today.getFullYear(), today.getMonth(), 1)
    return currentMonthDate <= todayMonthDate
  }

  const handlePrevMonth = () => {
    if (!isCurrentMonthOrEarlier()) {
      setCurrentMonth(new Date(year, month - 1, 1))
    }
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day)
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const clickedDateOnly = new Date(year, month, day)

    // Allow today and future dates
    if (clickedDateOnly >= todayDateOnly) {
      onDateSelect(clickedDate)
    }
  }

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  const isDateInPast = (day: number) => {
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const clickedDateOnly = new Date(year, month, day)
    // Only disable dates that are before today (not today itself)
    return clickedDateOnly < todayDateOnly
  }

  //Based off the Date object, we determine what any given month will look like, and which days have already passed
  const renderDays = () => {
    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateInPast(day)
      const selected = isDateSelected(day)

      days.push(
        <div
          key={day}
          className={`calendar-day ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
          onClick={() => !disabled && handleDateClick(day)}
        >
          <span className="calendar-day-number">{day}</span>
          {selected && <span className="calendar-day-indicator"></span>}
        </div>
      )
    }

    return days
  }

  return (
    <div className="calendar">
      <div className="calendar-header">
          <h3 className="calendar-month-year">
              {monthNames[month]} {year}
          </h3>
          <div className="calendar-nav-button-container">
        <button
          onClick={handlePrevMonth}
          className={`calendar-nav-button ${isCurrentMonthOrEarlier() ? 'disabled' : ''}`}
          disabled={isCurrentMonthOrEarlier()}
        >
          <ChevronLeft />
        </button>
        <button onClick={handleNextMonth} className="calendar-nav-button"><ChevronRight /></button>
        </div>
      </div>
      <div className="calendar-weekdays">
         {/* Renders the days of the week, i.e. M T W T F, at top of calendar */}
        {weekDays.map((day, index) => (
          <div key={index} className="calendar-weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-days">
        {renderDays()}
      </div>
    </div>
  )
}

export default Calendar

