/** Curated Google reviews. Single source of truth — used by /testimonies,
 *  the homepage reviews section, and the aggregateRating/review JSON-LD in
 *  lib/site.ts. Empty until real CACNA reviews are available — these were
 *  real reviews for a different, unrelated church and must not be reused. */
export interface GoogleReview {
  name: string;
  isLocalGuide?: boolean;
  quote: string;
  rating: number;
}

export const googleReviews: GoogleReview[] = [];

/** Aggregate over the curated set above — matches what is shown on-site. */
export const REVIEW_AVERAGE = 0;
export const REVIEW_COUNT = googleReviews.length;
