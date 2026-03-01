import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    text: "The healing session was transformative. I felt a profound sense of calm and balance that lasted for days.",
    author: "Priya S.",
  },
  {
    text: "Energy awareness changed my perspective on wellness. I now understand how to maintain my inner peace.",
    author: "Rahul M.",
  },
  {
    text: "The workshops are incredible. Every session teaches something new about mindful living and self-care.",
    author: "Anjali K.",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 px-4 bg-accent/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What People Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Experiences from our community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card"
            >
              <CardContent className="p-8 space-y-4">
                <Quote className="text-primary/40" size={40} />
                <p className="text-foreground/80 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <p className="text-muted-foreground font-medium">
                  — {testimonial.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
