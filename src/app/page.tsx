import {
    ContactSection, FAQSection, FeaturesSection, Footer, HeroSection, HowItWorksSection,
    TemplateGallery, TestimonialsSection
} from '@/features/home/components';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <HowItWorksSection />
      <TemplateGallery />
      <FeaturesSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;
