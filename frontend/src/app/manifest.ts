import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bogura Kothon",
    short_name: "BoguraKothon",
    description: "Multilingual newsroom with offline reading support",
    start_url: "/bn",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f766e",
    lang: "bn",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
