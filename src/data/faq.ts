import type { FAQItem } from "@/types/content";

export const faqItems: FAQItem[] = [
  {
    id: "what-is-this-site",
    question: "What is this guide site for?",
    answer:
      "This site is a launch-ready guide hub template. Replace the placeholder copy with verified facts for the selected game before publishing.",
    pageIds: ["home", "faq", "about"],
    category: "site",
    schemaEligible: true,
    sourceStatus: "internal",
  },
  {
    id: "is-official",
    question: "Is this an official game website?",
    answer:
      "No. This template is designed for an unofficial guide or wiki site. Official facts should be sourced from the game's publisher, developer, or store pages.",
    pageIds: ["home", "faq", "about"],
    category: "site",
    schemaEligible: true,
    sourceStatus: "internal",
  },
  {
    id: "release-date-known",
    question: "Where should release date information come from?",
    answer:
      "Use only official store pages, publisher announcements, developer posts, or official press materials for release timing.",
    pageIds: ["release-date", "faq"],
    category: "release",
    schemaEligible: true,
    sourceStatus: "placeholder",
  },
  {
    id: "platforms-known",
    question: "Which platforms should be listed?",
    answer:
      "List only platforms confirmed by official sources. If the platform list is incomplete, say it is pending instead of guessing.",
    pageIds: ["release-date", "faq", "wiki"],
    category: "platform",
    schemaEligible: true,
    sourceStatus: "placeholder",
  },
  {
    id: "guide-depth",
    question: "How detailed should V1 guides be?",
    answer:
      "V1 should provide a clean structure and safe starter guidance. Deep walkthroughs, item tables, maps, and build advice belong to later content work.",
    pageIds: ["guides", "faq"],
    category: "gameplay",
    schemaEligible: true,
    sourceStatus: "internal",
  },
];

