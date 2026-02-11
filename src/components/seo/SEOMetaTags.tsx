import { WebsiteJsonLd, SoftwareApplicationJsonLd } from "@/components/seo/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://self-evolving.vercel.app';

export default function SEOMetaTags() {
  return (
    <>
      <WebsiteJsonLd />
      <SoftwareApplicationJsonLd
        name="Self-Evolving Website"
        description="A web-based game development battle where AI models autonomously evolve the codebase."
        applicationCategory="GameApplication"
        operatingSystem="Web Browser"
        url={siteUrl}
      />
    </>
  );
}
