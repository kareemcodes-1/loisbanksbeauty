import Script from "next/script";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LoisBanks Beauty",
    url: "https://loisbanksbeauty.com",
    logo: "https://res.cloudinary.com/datpkisht/image/upload/v1788105362/aduppkeags21kxmmmsbr.svg",
    sameAs: [
    "https://www.instagram.com/loisbanks_hair",
  ],
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