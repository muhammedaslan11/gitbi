export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"] as const;
export type Day = (typeof DAYS)[number];

export const DAY_START = 8;
export const DAY_END = 22;
export const TOTAL_MIN = (DAY_END - DAY_START) * 60;

export function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(m: number) {
  const h = Math.floor(m / 60);
  const mins = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

export function getPercentage(t: string) {
  return ((timeToMinutes(t) - DAY_START * 60) / TOTAL_MIN) * 100;
}

export function getWidthPercentage(start: string, end: string) {
  return ((timeToMinutes(end) - timeToMinutes(start)) / TOTAL_MIN) * 100;
}

/**
 * Finds the intersection of available time slots for all participants.
 * A time is "fully available" if EVERY participant is available.
 */
export function findCommonAvailableRanges(day: Day, participants: any[]) {
  if (participants.length === 0) return [];

  // Initialize common availability as true for all minutes if there's at least one participant
  // But wait, if someone hasn't entered any slot for that day, are they available or not?
  // Usually, in this context, if they didn't enter anything, they are NOT available.
  
  const availabilityCount = new Array(TOTAL_MIN).fill(0);
  
  for (const p of participants) {
    const daySlots = (p.slots || []).filter((s: any) => s.day === day);
    for (const s of daySlots) {
      const st = Math.max(0, timeToMinutes(s.start) - DAY_START * 60);
      const en = Math.min(TOTAL_MIN, timeToMinutes(s.end) - DAY_START * 60);
      for (let i = st; i < en; i++) availabilityCount[i]++;
    }
  }

  const ranges: string[] = [];
  let start: number | null = null;
  const requiredCount = participants.length;

  for (let i = 0; i <= TOTAL_MIN; i++) {
    const isCommonlyAvailable = i < TOTAL_MIN ? availabilityCount[i] === requiredCount : false;
    
    if (isCommonlyAvailable && start === null) {
      start = i;
    }
    
    if (!isCommonlyAvailable && start !== null) {
      const s = DAY_START * 60 + start;
      const e = DAY_START * 60 + i;
      if (e - s >= 30) {
        ranges.push(`${minutesToTime(s)}–${minutesToTime(e)}`);
      }
      start = null;
    }
  }
  
  // If no one is 100% available together, maybe show times where MOST are available?
  // For now, let's stick to 100% to keep it simple as per user's "magic matcher" concept.
  return ranges;
}
