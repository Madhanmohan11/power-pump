import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '@/assets/power-pump-logo.jpeg';

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-16">
      <div className="container mx-auto px-4">
        
        <div className="grid md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img
                src={logo}
                alt="Power Pump"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="font-display text-2xl tracking-wider">
                POWER PUMP
              </span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Transform your body and mind at Power Pump – Made in Malaiyanur.
              Join our community and start your journey to a stronger you.
            </p>

            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center
                             text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-4">QUICK LINKS</h4>
            <ul className="space-y-3">
              {['About Us', 'Membership', 'Trainers', 'Classes', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-display text-lg mb-4">HOURS</h4>
            <ul className="space-y-3 text-muted-foreground">
              <li>Monday – Sunday: 24 Hours</li>
              <li className="text-primary font-medium">Open 24/7!</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Power Pump – Made in Malaiyanur. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <Link
              to="/admin"
              className="hover:text-primary transition-colors font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
