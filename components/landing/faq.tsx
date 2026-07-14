import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'Do I need a business license or LLC?',
    answer:
      'No. You only need a Polygon wallet address to receive payouts. There are no identity checks, no business registration requirements, and no merchant account underwriting. Perfect for pre-incorporation, MVP, or soft-launch businesses.',
  },
  {
    question: 'Do my customers need a crypto wallet?',
    answer:
      'No. Your customers pay with a credit card, debit card, Apple Pay, or Google Pay through a hosted checkout. The wallet field on the on-ramp is pre-filled with YOUR address and hidden from view. They never paste an address, never pick a chain, and never know crypto is involved.',
  },
  {
    question: 'What does the customer see on their bank statement?',
    answer:
      'Their statement reads "USDC PURCHASE" or the on-ramp provider\u2019s name. No product keyword, no high-risk merchant category code. Nothing for a bank risk team to flag.',
  },
  {
    question: 'How do I know I got paid?',
    answer:
      'Three ways, all instant: the USDC lands in your wallet (check any Polygon explorer), your dashboard shows the transaction in real time, and an HMAC-signed webhook fires to your server so your store can auto-mark the order as paid.',
  },
  {
    question: 'Can a customer charge back like on Stripe?',
    answer:
      'Card disputes are handled by the on-ramp provider that processed the card, not by you. Your USDC settlement is final \u2014 funds in your wallet cannot be clawed back. That is why we can operate with zero rolling reserve.',
  },
  {
    question: 'What if my customer\u2019s card is declined?',
    answer:
      'The checkout automatically surfaces alternative rails ranked by approval rate for their country and card BIN. If one on-ramp declines, the customer can retry with another in one click \u2014 same link, no restart.',
  },
  {
    question: 'How do I get my money out (EUR / USD) once I have USDC?',
    answer:
      'USDC on Polygon is accepted at every major exchange (Coinbase, Kraken, Binance). Transfer it there and cash out to your bank account via SEPA or wire. Many merchants also spend directly via crypto debit cards, or pay suppliers in USDC/USDT.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'A flat platform commission per successful transaction (see pricing above) plus the on-ramp\u2019s own pass-through fee, which varies by rail from 1.5%. No monthly fee, no setup fee, no reserve, no minimums. You receive roughly 93\u201397% of the charged amount in USDC.',
  },
  {
    question: 'How do I pass the transaction fees to my customer?',
    answer:
      'Simply price your products with the fee baked in, or add a checkout surcharge on your store. Since you know the total merchant fee per rail up front, a flat 5\u20137% markup covers it completely.',
  },
  {
    question: 'What happens if you shut down tomorrow?',
    answer:
      'Nothing happens to your money. We are non-custodial \u2014 funds settle directly from the card processor to your wallet and never pass through us. Historic settlements are already in your wallet; only the link-generation dashboard would go away.',
  },
  {
    question: 'What can I sell?',
    answer:
      'We serve high-risk verticals traditional processors decline \u2014 peptides, research chemicals, CBD, kratom, nutraceuticals, supplements, adult, gaming, kava, and more. Anything illegal is strictly prohibited.',
  },
  {
    question: 'Can I integrate this into my website or store?',
    answer:
      'Yes. Every payment link is a simple URL you can put behind any buy button on Shopify, WooCommerce, or a custom site. Register a webhook and your orders auto-mark as paid the moment USDC settles \u2014 no manual reconciliation.',
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-secondary/60">
      <div className="mx-auto max-w-3xl px-4 py-20 md:px-6 md:py-28">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            Straight answers.
          </h2>
          <p className="text-pretty leading-relaxed text-muted-foreground">
            Every high-risk shop owner asks these before switching.
          </p>
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
