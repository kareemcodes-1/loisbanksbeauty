import Script from "next/script";

export default function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LoisBanks Beauty",
    url: "https://loisbanksbeauty.com",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://loisbanksbeauty.com/shop?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    hasPart: [
      {
        "@type": "SiteNavigationElement",
        name: "Shop",
        url: "https://loisbanksbeauty.com/shop",
      },
      {
        "@type": "SiteNavigationElement",
        name: "About",
        url: "https://loisbanksbeauty.com/about",
      },
      {
        "@type": "SiteNavigationElement",
        name: "Contact",
        url: "https://loisbanksbeauty.com/contact",
      },
    ],
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}