import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Do I need to register a company or pass KYC?',
    answer:
      'No. You only need a Polygon wallet address to receive payouts. There are no identity checks, no business registration requirements, and no merchant account underwriting.',
  },
  {
    question: 'How do my customers pay?',
    answer:
      'Customers pay with a credit card, debit card, Apple Pay, or Google Pay through a hosted checkout page powered by licensed onramp partners like Wert and MoonPay. They never need to know crypto is involved.',
  },
  {
    question: 'How and when do I get paid?',
    answer:
      'Payments settle as USDC on the Polygon network directly to the wallet address you set in your dashboard — typically within minutes of the card payment clearing. There are no holds or rolling reserves.',
  },
  {
    question: 'What about chargebacks?',
    answer:
      'Card disputes are handled by the onramp provider that processed the card, not by you. Your USDC settlement is final — funds in your wallet cannot be clawed back.',
  },
  {
    question: 'What can I sell?',
    answer:
      'We serve high-risk verticals that traditional processors decline — peptides, CBD, kratom, nutraceuticals, adult content, gaming, and more. Anything illegal is strictly prohibited.',
  },
  {
    question: 'Can I integrate this into my website?',
    answer:
      'Yes. Every payment link is a simple URL you can put behind any buy button. You can also register webhooks to receive signed, real-time payment notifications and automate order fulfillment.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-card/30">
      <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Questions, answered
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={faq.question} value={`item-${i}`}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent className="leading-relaxed text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
