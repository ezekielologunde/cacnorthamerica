import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "CAC Salvation",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FFF7EF",
    theme_color: "#D62828",
    icons: [
      { src: "/images/logo.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
