import Script from "next/script";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LoisBanks Beauty",
    url: "https://loisbanksbeauty.com",
    logo: "https://res.cloudinary.com/datpkisht/image/upload/v1788105362/aduppkeags21kxmmmsbr.svg",
    description:
      "Shop luxury human hair wigs, athleisure wear, pers, hair essentials kits and DIY styling tools. Premium quality, flawless textures and effortless glam — affordable luxury delivered worldwide.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "33a Sedona Mall, Opp Monty Suites, Adebayo Doherty Street",
      addressLocality: "Lekki Phase 1",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    areaServed: {
      "@type": "Country",
      name: "Nigeria",
    },
    sameAs: ["https://www.instagram.com/loisbanks_hair"],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}