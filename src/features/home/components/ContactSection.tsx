"use client"

import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast("Message Sent!", {
      description:
        "We'll get back to you within 24 hours with your custom invitation details.",
    });
    setFormData({
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      guestCount: "",
      message: "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Ready to Create Your{" "}
            <span className="text-primary">Perfect Invitation</span>?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Let&apos;s bring your vision to life with a stunning, personalized
            digital invitation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          <div className="bg-card p-6 sm:p-8 rounded-xl shadow-soft">
            <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
              Tell Us About Your Event
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                    className="text-sm sm:text-base"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Event Type *
                  </label>
                  <Select
                    onValueChange={(value) => handleChange("eventType", value)}
                  >
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="quinceanera">Quinceañera</SelectItem>
                      <SelectItem value="baptism">Baptism</SelectItem>
                      <SelectItem value="birthday">Birthday Party</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="baby-shower">Baby Shower</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Event Date
                  </label>
                  <Input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => handleChange("eventDate", e.target.value)}
                    className="text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Expected Guests
                  </label>
                  <Select
                    onValueChange={(value) => handleChange("guestCount", value)}
                  >
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select guest count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-25">1-25 guests</SelectItem>
                      <SelectItem value="26-50">26-50 guests</SelectItem>
                      <SelectItem value="51-100">51-100 guests</SelectItem>
                      <SelectItem value="101-200">101-200 guests</SelectItem>
                      <SelectItem value="200+">200+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tell us about your vision
                </label>
                <Textarea
                  placeholder="Describe your event style, color preferences, special details, or any specific requirements..."
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  rows={4}
                  className="text-sm sm:text-base"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-primary hover:shadow-elegant transform hover:scale-105 transition-all duration-300 text-base sm:text-lg py-3 sm:py-4"
              >
                Send My Request
                <Send className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </form>
          </div>

          <div className="space-y-6 sm:space-y-8">
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-soft">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-foreground mb-4 sm:mb-6">
                Get in Touch
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">
                      Email Us
                    </h4>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      hello@sweetinvite.com
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      We respond within 2 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">
                      Call Us
                    </h4>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      (555) 123-SWEET
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Mon-Fri 9am-6pm EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm sm:text-base">
                      Visit Us
                    </h4>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      123 Design Street
                      <br />
                      Creative District, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-primary p-6 sm:p-8 rounded-xl text-center">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground mx-auto mb-3 sm:mb-4" />
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-primary-foreground mb-2">
                Quick Response Guarantee
              </h3>
              <p className="text-primary-foreground/80 text-sm sm:text-base">
                We&apos;ll get back to you within 24 hours with a personalized quote
                and timeline for your invitation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
