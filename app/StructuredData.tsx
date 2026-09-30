type WebApplicationJsonLdProps = {
  name: string;
  url: string;
  description: string;
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ResizeFox",
        url: "https://resizefox.com/",
        description:
          "Free browser-based image tools and PDF converter for creating, merging, splitting, rotating and compressing PDF documents.",
      }}
    />
  );
}

export function FAQJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  return <JsonLd data={{
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }} />;
}

export function WebApplicationJsonLd({
  name,
  url,
  description,
}: WebApplicationJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        url,
        description,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements:
          "Requires JavaScript and a modern web browser with HTML5 Canvas support.",
        offers: {
          "@type": "Offer",
          price: 0,
          priceCurrency: "USD",
        },
      }}
    />
  );
}
