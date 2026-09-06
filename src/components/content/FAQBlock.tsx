import type { FAQItem } from "@/types/content";

export function FAQBlock({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs.length) {
    return null;
  }

  return (
    <section className="faq-block" aria-labelledby="faq-heading">
      <h2 id="faq-heading">FAQ</h2>
      <div className="faq-list">
        {faqs.map((faq) => (
          <details key={faq.id} className="faq-item">
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

