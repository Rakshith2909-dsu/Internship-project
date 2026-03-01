import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Instagram, MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BookingDialog from "./BookingDialog";

const Contact = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you soon.",
    });
  };

  return (
    <section id="contact" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            Ready to begin your healing journey?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border-border/50 bg-card">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    className="bg-background border-border"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    className="bg-background border-border"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    className="bg-background border-border min-h-[150px]"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & Booking */}
          <div className="space-y-8">
            <Card className="border-border/50 bg-card">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-6">
                    Connect With Us
                  </h3>
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/917676655152"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <MessageCircle size={24} />
                      <span>WhatsApp</span>
                    </a>
                    <a
                      href="https://www.instagram.com/ganora_holistic_hub?igsh=bWx1YTA0dmoyNXVl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors duration-300"
                    >
                      <Instagram size={24} />
                      <span>Instagram</span>
                    </a>
                    <div className="flex items-center gap-3 text-foreground/80">
                      <Mail size={24} />
                      <span>ganoraholistichub@gmail.com</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              size="lg"
              onClick={() => setIsBookingOpen(true)}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
            >
              Book a Healing Session
            </Button>
          </div>
        </div>
      </div>

      <BookingDialog open={isBookingOpen} onOpenChange={setIsBookingOpen} />
    </section>
  );
};

export default Contact;
