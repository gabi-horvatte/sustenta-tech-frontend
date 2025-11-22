export const formatDateString = (dateString: string) => {
  // Handle date-only strings (YYYY-MM-DD) or ISO strings that represent dates without time
  // Extract date part to avoid timezone conversion issues
  const dateOnly = dateString.split('T')[0]; // Remove time part if present
  const [year, month, day] = dateOnly.split('-').map(Number);

  // Create date in local timezone to avoid UTC conversion
  const localDate = new Date(year, month - 1, day);

  return localDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export const formatDateTimeString = (dateString: string) => {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}