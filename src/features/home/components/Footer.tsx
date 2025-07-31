import { Mail, MessageCircle, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
              <span className="text-primary">Sweet</span>Invite
            </h3>
            <p className="text-background/80 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
              Creating beautiful, personalized digital invitations for life&apos;s
              most precious moments. From weddings to quinceañeras, we help you
              celebrate in style.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/20 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors cursor-pointer">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-background" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-3 sm:mb-4 text-sm sm:text-base">
              Services
            </h4>
            <ul className="space-y-2 text-background/80 text-sm sm:text-base">
              <li className="hover:text-primary transition-colors cursor-pointer">
                Wedding Invitations
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Quinceañera Invites
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Baptism Announcements
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Birthday Invitations
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Custom Designs
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-background mb-3 sm:mb-4 text-sm sm:text-base">
              Support
            </h4>
            <ul className="space-y-2 text-background/80 text-sm sm:text-base">
              <li className="hover:text-primary transition-colors cursor-pointer">
                How It Works
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                FAQ
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Contact Us
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-primary transition-colors cursor-pointer">
                Terms of Service
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-6 sm:pt-8 text-center">
          <p className="text-background/60 text-xs sm:text-sm">
            © 2024 SweetInvite. All rights reserved. Making celebrations
            sweeter, one invitation at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
