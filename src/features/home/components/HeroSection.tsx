import { CheckCircle, ChevronRight, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';

// Hero Section
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute top-1/2 left-1/4 w-16 h-16 bg-sage/20 rounded-full blur-lg animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Your <span className="text-primary">Perfect</span> Digital
            <br />
            <span className="text-primary">Invitation Awaits</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed font-sans">
            Transform your special moments into stunning digital invitations.
            Personalized, elegant, and unforgettable — just like your
            celebration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="hover:shadow-elegant transform hover:scale-105 transition-all duration-300 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[3rem]"
            >
              Start Your Invitation
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-primary/30 text-foreground hover:bg-primary/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 w-full sm:w-auto min-h-[3rem]"
            >
              <Play className="mr-2 h-5 w-5" />
              See How It Works
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Ready in 24-48 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>Unlimited revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              <span>RSVP tracking included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
