/** Two-letter avatar fallback for a person's name, skipping a leading
 *  ministry title (Pastor, Prophet, Dr., (Mrs.)...). */
export function initials(name: string) {
  const parts = name.replace(/^(Pastor|Prophet|Evangelist|Apostle)\s+(Dr\.?\s+)?(\(Mrs\.?\)\s+)?/i, "").trim().split(/\s+/);
  return ((parts[0]?.[0] || "") + (parts[parts.length - 1]?.[0] || "")).toUpperCase();
}
