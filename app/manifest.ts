import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hesabi — حسابي",
    short_name: "Hesabi",
    description: "Bilingual everyday calculators for money, cars, lifestyle, and travel.",
    start_url: "/ar",
    display: "standalone",
    background_color: "#0b0f0e",
    theme_color: "#0f766e",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml", purpose: "any" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
