import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import mindfulLogo from "@/assets/mindful-wave-logo.svg";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-muted/50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={mindfulLogo} alt="Ganora Holistic Hub Logo" className="h-10 w-10" />
              <span className="text-xl font-semibold text-foreground">Ganora Holistic Hub</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A space dedicated to energy awareness, Pranic Healing, and mindfulness.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {["home", "about", "services", "sessions", "faq", "contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => scrollToSection(link)}
                  className="block text-left text-muted-foreground hover:text-foreground transition-colors duration-300 capitalize"
                >
                  {link}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <div className="space-y-2">
              <Link
                to="/privacy-policy"
                className="block text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="block text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Connect</h3>
            <div className="space-y-3">
              <a
                href="https://wa.me/917676655152"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
              <a
                href="https://www.instagram.com/ganora_holistic_hub?igsh=bWx1YTA0dmoyNXVl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300"
              >
                <Instagram size={20} />
                <span>Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {currentYear} Ganora Holistic Hub. All Rights Reserved.
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <span>•</span>
              <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
