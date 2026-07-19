// Shared shapes for convention sub-conference content, ported from the
// Convention project's lib/content/types.ts.
export interface Person {
  name: string;
  title?: string;
  role?: string;
}

export interface AgendaItem {
  time?: string;
  event: string;
  speaker?: string;
}

export interface ScheduleSession {
  dayLabel: string;
  timeRange: string;
  agenda: AgendaItem[];
}
