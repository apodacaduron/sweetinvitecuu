import { ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import template1 from '@/features/home/assets/template-1.jpg';
import template2 from '@/features/home/assets/template-2.jpg';
import template3 from '@/features/home/assets/template-3.jpg';
import template4 from '@/features/home/assets/template-4.jpg';

// Template Gallery Section
  export default function TemplateGallery() {
    const templates = [
      {
        id: 1,
        image: template1,
        title: "Romantic Garden",
        category: "Wedding",
        description: "Elegant floral design perfect for garden ceremonies and romantic celebrations"
      },
      {
        id: 2,
        image: template2,
        title: "Princess Dreams",
        category: "Quinceañera",
        description: "Royal-inspired design with delicate details for a fairytale celebration"
      },
      {
        id: 3,
        image: template3,
        title: "Sacred Blessing",
        category: "Baptism",
        description: "Peaceful and serene design celebrating this holy milestone"
      },
      {
        id: 4,
        image: template4,
        title: "Modern Elegance",
        category: "General",
        description: "Contemporary design suitable for any special occasion"
      }
    ];

    return (
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-secondary">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Featured <span className="text-primary">Templates</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover our collection of beautifully crafted invitation designs
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            {templates.map((template, index) => (
              <div 
                key={template.id} 
                className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transform hover:-translate-y-2 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={template.image.src} 
                    alt={template.title}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 sm:px-3 py-1 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-full">
                      {template.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground mb-2">
                    {template.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {template.description}
                  </p>
                  <Button
                    variant="outline" 
                    size="sm" 
                    className="w-full border-primary/30 text-primary hover:bg-primary/10 text-sm"
                  >
                    Preview Design
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              View All Templates
              <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>
      </section>
    );
  };