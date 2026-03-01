import { Card, CardContent } from "@/components/ui/card";
import { Award, Heart, Users, Target } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            About Ganora Holistic Hub
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in holistic wellness and energy healing
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="border-border/50 bg-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Target className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower individuals with the knowledge and tools for holistic healing, 
                    helping them achieve balance, wellness, and a deeper connection with their 
                    inner self through Pranic Healing and mindful living practices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Heart className="text-primary" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-3">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a community where healing is accessible to all, where people 
                    understand their energy bodies, and where wellness is approached holistically 
                    — nurturing body, mind, and spirit in harmony.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What Makes Us Different */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            What Makes Us Different
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Award className="text-primary" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">
                Certified Practitioners
              </h4>
              <p className="text-muted-foreground">
                Trained and certified in Pranic Healing with years of experience 
                in energy healing and wellness.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Heart className="text-primary" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">
                Personalized Care
              </h4>
              <p className="text-muted-foreground">
                Every individual is unique. We tailor our approach to your specific 
                needs, goals, and energy patterns.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h4 className="text-xl font-semibold text-foreground mb-3">
                Holistic Approach
              </h4>
              <p className="text-muted-foreground">
                We address not just symptoms, but the root causes — combining 
                ancient wisdom with modern wellness practices.
              </p>
            </div>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">Our Story</h3>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              Ganora Holistic Hub was born from a deep passion for holistic healing and 
              a desire to make energy healing accessible to everyone seeking balance and wellness.
            </p>
            <p>
              Founded on the principles of Pranic Healing — a no-touch energy healing system 
              — we have helped countless individuals overcome physical discomfort, emotional 
              imbalances, and mental stress through the power of energy awareness.
            </p>
            <p>
              Our journey began with a simple belief: that everyone has the innate ability 
              to heal themselves when given the right guidance, tools, and support. Today, 
              we continue this mission by offering personalized healing sessions, educational 
              workshops, and a nurturing space for transformation.
            </p>
            <p className="font-semibold text-foreground italic">
              "Healing is not just about fixing what's broken — it's about awakening to wholeness."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
