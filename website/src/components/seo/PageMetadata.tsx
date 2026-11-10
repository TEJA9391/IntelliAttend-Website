"use client";

import { useEffect } from "react";

interface PageMetadataProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}

export function PageMetadata({
  title,
  description,
  canonical,
  ogImage = "https://www.intelliattend.app/images/og-default.png",
}: PageMetadataProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | IntelliAttend`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", `${title} | IntelliAttend`);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", description);
    }

    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute("content", ogImage);
    }

    // Update canonical URL
    if (canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (!canonicalLink) {
        canonicalLink = document.createElement("link");
        canonicalLink.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.setAttribute("href", canonical);
    }
  }, [title, description, canonical, ogImage]);

  return null;
}
