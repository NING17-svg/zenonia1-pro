import type { FAQItem } from "@/types/content";
import { generatedFaqs } from "@/data/pages-generated/generated-faqs";

export const faqItems: FAQItem[] = [
  ...generatedFaqs,
];