import { BarChart3, Clock, Heart, Palette, Shield, Users } from 'lucide-react';

export default function FeaturesSection() {
    const features = [
      {
        icon: Palette,
        title: "Custom Design",
        description: "Each invitation is personally crafted to match your vision and style preferences"
      },
      {
        icon: Users,
        title: "RSVP Management",
        description: "Built-in RSVP forms that automatically collect and organize guest responses"
      },
      {
        icon: BarChart3,
        title: "Guest Dashboard",
        description: "Private dashboard to track responses, dietary preferences, and special requests"
      },
      {
        icon: Clock,
        title: "Fast Delivery",
        description: "Receive your completed invitation website within 24-48 hours"
      },
      {
        icon: Heart,
        title: "Personal Touch",
        description: "Share your love story and special details to make it uniquely yours"
      },
      {
        icon: Shield,
        title: "Secure & Reliable",
        description: "Your guest data is protected with enterprise-level security measures"
      }
    ];

    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Why Choose <span className="text-primary">SweetInvite</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We combine beautiful design with powerful functionality to create invitation experiences that wow your guests
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group p-4 sm:p-6 bg-card rounded-xl shadow-soft hover:shadow-elegant transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                
                <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };