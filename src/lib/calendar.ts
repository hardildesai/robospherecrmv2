// ============================================
// Calendar Utilities
// ============================================

export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
}

export const getMonthName = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

export const getCalendarDays = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // 0 = Sunday, 1 = Monday, ... 6 = Saturday
    const startDayOfWeek = firstDay.getDay();

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Padding for previous month
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
        const d = new Date(year, month - 1, prevMonthLastDay - i);
        days.push({
            date: d,
            isCurrentMonth: false,
            isToday: d.getTime() === today.getTime()
        });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
        const d = new Date(year, month, i);
        days.push({
            date: d,
            isCurrentMonth: true,
            isToday: d.getTime() === today.getTime()
        });
    }

    // Padding for next month (fill up to 42 for 6 rows of 7)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
        const d = new Date(year, month + 1, i);
        days.push({
            date: d,
            isCurrentMonth: false,
            isToday: d.getTime() === today.getTime()
        });
    }

    return days;
};

export const isSameDay = (d1: Date, d2: Date | string): boolean => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};
