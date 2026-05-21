import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00',
];

export default function BookingCalendar({ selectedDate, selectedTime, onDateChange, onTimeChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewDate, setViewDate] = useState(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectDate = (day) => {
    const date = new Date(year, month, day);
    if (date < today) return;
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onDateChange(iso);
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return iso === selectedDate;
  };

  const isPast = (day) => {
    const date = new Date(year, month, day);
    return date < today;
  };

  const isSunday = (day) => new Date(year, month, day).getDay() === 0;

  // Grid cells (fill empty cells before first day)
  const cells = Array.from({ length: firstDay }, () => null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="space-y-6">
      {/* Month navigator */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-xl text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-gray-800">
            {MONTHS[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-xl text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Cells */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const past = isPast(day);
            const sun = isSunday(day);
            const sel = isSelected(day);
            const disabled = past || sun;

            return (
              <button
                key={i}
                type="button"
                disabled={disabled}
                onClick={() => selectDate(day)}
                className={[
                  'aspect-square text-sm rounded-xl transition-all duration-150',
                  'flex items-center justify-center font-medium',
                  sel
                    ? 'bg-pink-500 text-white shadow-md'
                    : disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600',
                ].join(' ')}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Selecciona un horario</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => onTimeChange(time + ':00')}
                className={[
                  'py-2 px-3 text-sm rounded-xl border font-medium transition-all duration-150',
                  selectedTime === time + ':00' || selectedTime === time
                    ? 'bg-pink-500 text-white border-pink-500 shadow-md'
                    : 'text-gray-700 border-gray-200 hover:border-pink-300 hover:text-pink-500',
                ].join(' ')}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
