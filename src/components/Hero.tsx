import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight">
            Ganora Holistic Hub
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-4 italic font-light">
            the art of complete living
          </p>
          <p className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            A space dedicated to energy awareness, Pranic Healing, and mindfulness — 
            guiding you towards balance and well-being.
          </p>
          <Button
            onClick={scrollToServices}
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Explore Ganora
          </Button>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="text-foreground/60" size={32} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
