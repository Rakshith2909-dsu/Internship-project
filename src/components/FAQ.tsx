import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What is Pranic Healing?",
    answer: "Pranic Healing is a no-touch energy healing system that uses prana (life force) to balance, harmonize and transform the body's energy processes. It accelerates the body's innate ability to heal itself by working on the energy body rather than directly on the physical body."
  },
  {
    question: "Is my first session really free?",
    answer: "Yes! We offer your first healing session completely free so you can experience the benefits of Pranic Healing without any commitment. Subsequent sessions are ₹500 per session."
  },
  {
    question: "How long is a typical healing session?",
    answer: "A standard healing session typically lasts between 45-60 minutes. This includes a brief consultation, the healing session itself, and time for discussion and questions afterward."
  },
  {
    question: "Do I need to prepare anything before my session?",
    answer: "No special preparation is needed. We recommend coming with an open mind, wearing comfortable clothing, and arriving a few minutes early to relax. It's also helpful to avoid heavy meals right before your session."
  },
  {
    question: "How many sessions will I need?",
    answer: "The number of sessions varies depending on your individual needs and goals. Some people experience significant benefits after just one or two sessions, while others prefer ongoing support. We'll discuss a personalized plan during your consultation."
  },
  {
    question: "Can Pranic Healing replace medical treatment?",
    answer: "No. Pranic Healing is a complementary healing modality and should not replace conventional medical treatment. It works best alongside medical care to support and accelerate your body's natural healing process. Always consult your healthcare provider for medical concerns."
  },
  {
    question: "Is Pranic Healing safe?",
    answer: "Yes, Pranic Healing is completely safe and non-invasive. There is no physical contact involved, and it has no known side effects. It can be used safely alongside conventional medical treatment."
  },
  {
    question: "What can Pranic Healing help with?",
    answer: "Pranic Healing can help with a wide range of physical, emotional, and psychological conditions including stress, anxiety, depression, pain, fatigue, relationship issues, and various chronic ailments. It also promotes overall wellness and energy balance."
  },
  {
    question: "Can I book sessions for someone else?",
    answer: "Yes, you can book sessions for family members or friends. However, the person receiving the healing should be aware and willing to receive the treatment. Distant healing is also available in some cases."
  },
  {
    question: "What is your cancellation policy?",
    answer: "We understand that plans change. Please provide at least 24 hours notice if you need to cancel or reschedule your session. Late cancellations or no-shows may be subject to a fee."
  },
  {
    question: "Do you offer group sessions or workshops?",
    answer: "Yes! We regularly conduct group healing sessions and workshops on energy awareness, meditation, and mindful living. Check our sessions page or contact us for upcoming workshops."
  },
  {
    question: "How do I pay for sessions?",
    answer: "We accept online payments through our secure booking system via Razorpay. You can pay using credit/debit cards, UPI, net banking, or digital wallets. Payment is required at the time of booking for paid sessions."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="text-primary" size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about Pranic Healing and our services
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border/50 rounded-lg px-6 hover:shadow-md transition-shadow duration-300"
            >
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="text-lg font-semibold text-foreground pr-4">
                  {faq.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center bg-card border border-border/50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Still have questions?
          </h3>
          <p className="text-muted-foreground mb-6">
            We're here to help! Reach out to us via WhatsApp or email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/917676655152"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors duration-300"
            >
              Contact on WhatsApp
            </a>
            <a
              href="mailto:ganoraholistichub@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors duration-300"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
