import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/privacy", "/terms"],
      disallow: ["/chat", "/dashboard", "/directory", "/drive", "/settings", "/api/", "/auth/"],
    },
    sitemap: "https://sysanalyst.dev/sitemap.xml",
  };
}
