export const formatBirthDate = (birthDate: string) => {
  return new Date(birthDate).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}