/** Curated Google reviews for CAC Salvation Center.
 *  Single source of truth — used by /testimonies, the homepage reviews
 *  section, and the aggregateRating/review JSON-LD in lib/site.ts.
 *  Each is a real 5-star Google review. */
export interface GoogleReview {
  name: string;
  isLocalGuide?: boolean;
  quote: string;
  rating: number;
}

export const googleReviews: GoogleReview[] = [
  { name: "Paul Sunmbola", isLocalGuide: true, rating: 5, quote: "Have you being in the community or new, and need a place where you can call home? This is the place to be. Spirit filled and offers opportunity for growth. Wonderful Sunday School sessions and Great service experiences. Join us as we worship the Lord, you will be glad you did. God bless you." },
  { name: "Tolu (PTM)", rating: 5, quote: "This District Cordinating Council of the Christ Apostolic Church is a place where you want to worship. The pastor, his family, and congregation are honest, faithful, loving, and amazing. They preach the word of God, pray fervently and more." },
  { name: "Riss", rating: 5, quote: "Great church, great service. All pastors are great and Bible centered. This is a church that really support and stand with one through the bad and good times. They exhibits the through love of Jesus Christ." },
  { name: "Ifemi Mercy", rating: 5, quote: "More than love it / A family church to attend." },
  { name: "T", isLocalGuide: true, rating: 5, quote: "Loved the entire service, nice place to worship." },
  { name: "Abiodun Adegoroye", rating: 5, quote: "A great place to worship God and fellowship." },
  { name: "Wole Toye", rating: 5, quote: "The challenges event hall is good." },
  { name: "Ademola Adesina", isLocalGuide: true, rating: 5, quote: "A living church of the Lord where prayers are answered." },
  { name: "Alex Owanikin", rating: 5, quote: "Beautiful and Rewarding." },
];

/** Aggregate over the curated set above — matches what is shown on-site. */
export const REVIEW_AVERAGE = 5;
export const REVIEW_COUNT = googleReviews.length;
