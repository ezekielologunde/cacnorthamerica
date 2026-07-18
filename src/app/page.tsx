import CinematicHero from "@/components/public/CinematicHero";
import {
  getFeaturedEvent,
  getLeadersByCategory,
  getSiteContent,
} from "@/lib/data/queries";

const PHOTOS = [
  "https://cacnorthamerica.com/wp-content/uploads/2024/01/DSC_8969-1030x688.jpg",
  "https://cacnorthamerica.com/wp-content/uploads/2024/01/convention-13.jpg",
  "https://cacnorthamerica.com/wp-content/uploads/2024/01/convention-14.jpg",
  "https://cacnorthamerica.com/wp-content/uploads/2024/01/village07.jpg",
];

export default async function HomePage() {
  const [featuredEvent, welcome, zonalSuperintendents] = await Promise.all([
    getFeaturedEvent(),
    getSiteContent("home", "welcome"),
    getLeadersByCategory("zonal_superintendent"),
  ]);

  return (
    <CinematicHero
      photos={PHOTOS}
      welcome={welcome}
      zoneCount={zonalSuperintendents.length}
      featuredEvent={
        featuredEvent
          ? {
              title: featuredEvent.title,
              themeText: featuredEvent.themeText,
              location: featuredEvent.location,
              startDate: featuredEvent.startDate,
              endDate: featuredEvent.endDate,
              slug: featuredEvent.slug,
            }
          : undefined
      }
    />
  );
}
