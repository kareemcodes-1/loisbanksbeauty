import Script from "next/script";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "LoisBanks Beauty",
    url: "https://loisbanksbeauty.com",
    logo: "https://res.cloudinary.com/datpkisht/image/upload/v1788105362/aduppkeags21kxmmmsbr.svg",
    image: "https://res.cloudinary.com/datpkisht/image/upload/v1788105362/aduppkeags21kxmmmsbr.svg",
    description:
      "LoisBanks Beauty is a luxury destination for premium human hair wigs, beauty essentials and athleisure wear for women. Based in Lekki, Lagos, with worldwide delivery.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1st floor, Jubilee mall, Admiralty way, Lekki phase 1",
      addressLocality: "Lekki Phase 1",
      addressRegion: "Lagos",
      addressCountry: "NG",
    },
    areaServed: ["Nigeria", "United States", "United Kingdom", "Canada", "United Arab Emirates", "South Africa", "Ghana", "Australia"].map(
      (name) => ({ "@type": "Country", name })
    ),
    sameAs: [
      "https://www.instagram.com/loisbanks_hair",
      // add your TikTok, Facebook, etc.
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}