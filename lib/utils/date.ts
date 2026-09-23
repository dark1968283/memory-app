const MONTHS_PT = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function formatDatePt(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatMonthYear(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`;
}

export interface RelationshipDuration {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

export function getRelationshipDuration(startDate: string): RelationshipDuration {
  const start = new Date(startDate + "T00:00:00");
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}
