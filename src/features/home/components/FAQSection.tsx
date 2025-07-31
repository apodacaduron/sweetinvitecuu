import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';

export default function FAQSection() {
    const faqs = [
      {
        question: "How long does it take to receive my invitation?",
        answer: "We typically deliver your completed invitation website within 24-48 hours after receiving all your event details and any special requirements."
      },
      {
        question: "Can I request changes to my invitation?",
        answer: "Absolutely! We offer unlimited revisions to ensure your invitation perfectly captures your vision. Just let us know what changes you'd like, and we'll make them promptly."
      },
      {
        question: "How does the RSVP system work?",
        answer: "Your invitation includes a built-in RSVP form where guests can confirm attendance, dietary preferences, and special requests. You'll have access to a private dashboard to track all responses in real-time."
      },
      {
        question: "What types of events do you create invitations for?",
        answer: "We specialize in weddings, quinceañeras, baptisms, baby showers, birthday parties, anniversaries, and other special celebrations. Each design is customized to match your event's style and significance."
      },
      {
        question: "Is my guest information secure?",
        answer: "Yes! We use enterprise-level security measures to protect all guest data. Your information and your guests' details are kept completely confidential and secure."
      },
      {
        question: "Can I include photos and personal details?",
        answer: "Definitely! We encourage you to share photos, your love story, special messages, and any personal touches you'd like included. These details make your invitation uniquely yours."
      },
      {
        question: "How much does it cost?",
        answer: "Our pricing varies based on the complexity of your design and specific requirements. Contact us with your event details for a personalized quote that fits your budget."
      },
      {
        question: "Do you provide customer support?",
        answer: "Yes! We're here to help throughout the entire process. From initial consultation to final delivery, our team provides friendly support to ensure you're completely satisfied."
      }
    ];

    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about our invitation service
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`} 
                className="bg-card rounded-lg px-4 sm:px-6 shadow-soft hover:shadow-elegant transition-all duration-300"
              >
                <AccordionTrigger className="text-left hover:no-underline group py-4 sm:py-6">
                  <span className="font-serif text-base sm:text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4 sm:pb-6 text-sm sm:text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    );
  };