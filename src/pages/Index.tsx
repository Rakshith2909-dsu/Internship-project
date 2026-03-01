import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Sessions from "@/components/Sessions";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Blog from "@/components/Blog";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <About />
      <Services />
      <Sessions />
      <Testimonials />
      <Gallery />
      <Blog />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
