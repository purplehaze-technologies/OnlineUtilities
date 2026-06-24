/**
 * Date calculation helpers. Framework-free, reused by the Age Calculator and
 * any future tool that needs date arithmetic (countdown timer, date diff, etc.).
 * All functions use local-time Date objects to avoid UTC shift issues.
 */

/** Parse a "YYYY-MM-DD" string into a local-time Date (avoids UTC midnight shift). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export interface AgeDiff {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
  totalMinutes: number;
}

/** Calculate the precise difference between two dates. */
export function calcAge(dob: Date, target: Date): AgeDiff {
  let years = target.getFullYear() - dob.getFullYear();
  let months = target.getMonth() - dob.getMonth();
  let days = target.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    const prevMonthEnd = new Date(target.getFullYear(), target.getMonth(), 0);
    days += prevMonthEnd.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const totalDays = Math.floor((target.getTime() - dob.getTime()) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalHours = totalDays * 24;
  const totalMinutes = totalHours * 60;

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    totalMinutes,
  };
}

const ZODIAC: Array<{ sign: string; month: number; day: number }> = [
  { sign: "Capricorn", month: 1, day: 19 },
  { sign: "Aquarius", month: 2, day: 18 },
  { sign: "Pisces", month: 3, day: 20 },
  { sign: "Aries", month: 4, day: 19 },
  { sign: "Taurus", month: 5, day: 20 },
  { sign: "Gemini", month: 6, day: 20 },
  { sign: "Cancer", month: 7, day: 22 },
  { sign: "Leo", month: 8, day: 22 },
  { sign: "Virgo", month: 9, day: 22 },
  { sign: "Libra", month: 10, day: 22 },
  { sign: "Scorpio", month: 11, day: 21 },
  { sign: "Sagittarius", month: 12, day: 21 },
];

/** Approximate Western zodiac sign for a given birth date. */
export function getZodiacSign(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const entry = ZODIAC.find(
    (z) => m < z.month || (m === z.month && d <= z.day)
  );
  return entry?.sign ?? "Capricorn";
}

/** Day of the week as a full English name. */
export function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}

/** Number of days until the next birthday (0 if today). */
export function daysUntilNextBirthday(
  dob: Date,
  from: Date = new Date()
): number {
  const thisYear = from.getFullYear();
  let next = new Date(thisYear, dob.getMonth(), dob.getDate());
  if (next < from) next = new Date(thisYear + 1, dob.getMonth(), dob.getDate());
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((next.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}
