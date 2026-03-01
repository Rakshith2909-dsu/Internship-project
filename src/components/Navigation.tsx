import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import mindfulLogo from "@/assets/mindful-wave-logo.svg";
import { useAuth } from "@/components/Auth/AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About", id: "about" },
    { label: "Services", id: "services" },
    { label: "Sessions", id: "sessions" },
    { label: "Testimonials", id: "testimonials" },
    { label: "Gallery", id: "gallery" },
    { label: "Blog", id: "blog" },
    { label: "FAQ", id: "faq" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection("home")}>
            <img src={mindfulLogo} alt="Ganora Holistic Hub Logo" className="h-10 w-10" />
            <span className="text-xl font-semibold text-foreground">Ganora Holistic Hub</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="text-foreground/80 hover:text-foreground transition-colors duration-300 text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
            
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("sessions")}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Book Session
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User size={18} />
                      {profile?.full_name?.split(' ')[0] || 'Account'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      Profile
                    </DropdownMenuItem>
                    {profile?.role === 'admin' && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                          Admin Panel
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  onClick={() => scrollToSection('sessions')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Book Sessions
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left text-foreground/80 hover:text-foreground transition-colors duration-300 py-2"
              >
                {link.label}
              </button>
            ))}
            
            {user ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => scrollToSection("sessions")}
                  className="w-full border-primary text-primary hover:bg-primary/10"
                >
                  Book Session
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                  className="w-full"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}
                  className="w-full"
                >
                  Profile
                </Button>
                {profile?.role === 'admin' && (
                  <Button
                    variant="outline"
                    onClick={() => { navigate('/admin/dashboard'); setIsMobileMenuOpen(false); }}
                    className="w-full border-purple-500 text-purple-500 hover:bg-purple-50"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={handleSignOut}
                  className="w-full"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  onClick={() => scrollToSection('sessions')}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Book Sessions
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
