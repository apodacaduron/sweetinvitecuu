import { CheckCircle, Clock, Palette, Send } from 'lucide-react';

export default function HowItWorksSection() {
    const steps = [
      {
        icon: Palette,
        number: 1,
        title: "Choose Your Style",
        description: "Browse our curated collection of elegant templates designed for weddings, quinceañeras, baptisms, and special celebrations"
      },
      {
        icon: Send,
        number: 2,
        title: "Send Your Details",
        description: "Share your event information, personal touches, and any special requests through our simple contact form"
      },
      {
        icon: CheckCircle,
        number: 3,
        title: "Receive Your Link",
        description: "Get your personalized invitation website with RSVP functionality and guest management dashboard"
      }
    ];

    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              How <span className="text-primary">SweetInvite</span> Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From inspiration to invitation in three simple steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="relative mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-soft">
                    <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                </div>
                
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-3 sm:mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-accent rounded-full text-accent-foreground font-medium text-sm sm:text-base">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              Ready in 24-48 hours
            </div>
          </div>
        </div>
      </section>
    );
  };