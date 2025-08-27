import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Phone } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4 font-headline">Faded</h3>
            <p className="text-muted-foreground mb-4">
              Your premium barbershop experience.
            </p>
             <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.facebook.com/FadedBarbershopBfHomes/" target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.instagram.com/fadedbarbersph" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link href="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link href="/my-bookings" className="hover:text-primary transition-colors">My Bookings</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>
          <div>
             <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic text-muted-foreground space-y-2">
                <p className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-1 shrink-0"/> 
                    <span>59 Aguirre Ave., BF Homes, Parañaque, Philippines</span>
                </p>
                <p className="flex items-center">
                    <Phone className="w-4 h-4 mr-2"/>
                    <a href="tel:+639260266667" className="hover:text-primary transition-colors">+63 926 026 6667</a>
                </p>
            </address>
          </div>
        </div>
        <div className="border-t border-muted mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Faded Barbershop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
