interface OrganizationJsonLdProps {
  url?: string;
  logo?: string;
  name?: string;
}

export function OrganizationJsonLd({
  url = "https://www.intelliattend.app",
  logo = "https://www.intelliattend.app/images/logo.png",
  name = "IntelliAttend",
}: OrganizationJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description:
      "IntelliAttend - Intelligent Attendance. Smart Campus. Manage attendance, schedules, SmartBoard, notifications, resources, analytics and communication from one intelligent platform.",
    sameAs: [
      "https://x.com/intelliattend",
      "https://www.linkedin.com/company/intelliattend/",
      "https://github.com/intelliattend",
      "https://www.youtube.com/@intelliattend-45",
      "https://discord.com/users/1563078786646540319",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      email: "support@intelliattend.app",
      availableLanguage: "English",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "100 Innovation Drive",
      addressLocality: "Tech City",
      addressRegion: "CA",
      postalCode: "94000",
      addressCountry: "US",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface WebsiteJsonLdProps {
  url?: string;
  name?: string;
  description?: string;
}

export function WebsiteJsonLd({
  url = "https://www.intelliattend.app",
  name = "IntelliAttend",
  description = "Intelligent Attendance. Smart Campus. Manage attendance, schedules, SmartBoard, notifications, resources, analytics and communication from one intelligent platform.",
}: WebsiteJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: `${url}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  url: string;
  price?: string;
  currency?: string;
}

export function ProductJsonLd({
  name,
  description,
  image,
  url,
  price = "0",
  currency = "USD",
}: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    image,
    url,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FAQJsonLdProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQJsonLd({ items }: FAQJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
