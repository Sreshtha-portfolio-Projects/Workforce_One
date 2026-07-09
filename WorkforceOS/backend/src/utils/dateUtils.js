export const formatDate = (date, format = 'YYYY-MM-DD') => {
  if (!date) return null;
  const d = new Date(date);
  
  if (format === 'YYYY-MM-DD') {
    return d.toISOString().split('T')[0];
  }
  
  if (format === 'DD/MM/YYYY') {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  return d.toISOString();
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

export const diffInDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isWeekend = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6;
};

export const calculateWorkingDays = (startDate, endDate, holidays = []) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dateStr = formatDate(current);
    if (!isWeekend(current) && !holidays.includes(dateStr)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};

export const isDateInRange = (date, startDate, endDate) => {
  const d = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return d >= start && d <= end;
};

export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

export const getCurrentFinancialYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  if (month < 3) {
    return `${year - 1}-${year}`;
  }
  return `${year}-${year + 1}`;
};
