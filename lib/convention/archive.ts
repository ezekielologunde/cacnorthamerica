// Past convention years — real, confirmed dates/themes only. 2024/2025 are
// intentionally excluded: their dates are known but their themes were never
// confirmed, and a placeholder theme would misrepresent a real historical
// record.
export interface PastConventionYear {
  year: number;
  theme: string;
  startIso: string;
  endIso: string;
}

export const pastConventionYears: PastConventionYear[] = [
  { year: 2023, theme: "Proving Our Growth Through Sound Doctrine", startIso: "2023-07-10", endIso: "2023-07-15" },
  { year: 2022, theme: "Grow in the Grace and Knowledge of Our Lord Jesus", startIso: "2022-07-11", endIso: "2022-07-16" },
];
