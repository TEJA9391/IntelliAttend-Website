import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/portal/", "/login/", "/register/", "/get-started/"],
      },
    ],
    sitemap: "https://www.intelliattend.app/sitemap.xml",
  };
}
