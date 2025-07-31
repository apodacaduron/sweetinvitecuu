import { Quote, Star } from 'lucide-react';

export default function TestimonialsSection() {
    const testimonials = [
      {
        name: "Maria & Carlos",
        event: "Wedding",
        text: "SweetInvite made our wedding planning so much easier! The invitation was absolutely stunning and our guests loved the RSVP feature. We received so many compliments!",
        rating: 5
      },
      {
        name: "Ana Rodriguez",
        event: "Quinceañera",
        text: "The team understood exactly what we wanted for Sofia's quinceañera. The design was perfect and captured the essence of this special celebration beautifully.",
        rating: 5
      },
      {
        name: "Jennifer Smith",
        event: "Baby Baptism",
        text: "From start to finish, the process was seamless. The invitation reflected the peaceful and sacred nature of our son's baptism perfectly. Highly recommend!",
        rating: 5
      }
    ];

    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              What Our <span className="text-primary">Clients Say</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join hundreds of happy couples and families who trusted us with their special moments
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="bg-card p-6 sm:p-8 rounded-xl shadow-soft hover:shadow-elegant transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up relative"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30 absolute top-4 sm:top-6 right-4 sm:right-6" />
                
                <div className="flex items-center gap-1 mb-3 sm:mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-gold text-gold" />
                  ))}
                </div>
                
                <p className="text-foreground leading-relaxed mb-4 sm:mb-6 italic text-sm sm:text-base">
                  &quot;{testimonial.text}&quot;
                </p>
                
                <div className="border-t border-border pt-3 sm:pt-4">
                  <p className="font-semibold text-foreground text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.event}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-background rounded-full shadow-soft">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-foreground font-medium text-sm sm:text-base">4.9/5 from 200+ reviews</span>
            </div>
          </div>
        </div>
      </section>
    );
  };