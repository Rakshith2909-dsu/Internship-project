import { Card, CardContent } from "@/components/ui/card";
import { Palette, Award, Sparkles, Brain, Sun, Users, GraduationCap, Target, Wifi, BookOpen, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const services = [
  {
    icon: Palette,
    title: "Art & Movement Expressive Sessions",
    description: "Creative sessions using art and movement techniques to support emotional expression, relaxation, and self-awareness in group settings.",
  },
  {
    icon: Award,
    title: "Certificate Courses",
    description: "Structured non-clinical certificate programs in art and movement techniques designed for students, educators, and facilitators.",
  },
  {
    icon: Sparkles,
    title: "Pranic Healing Sessions",
    description: "Energy-based sessions aimed at supporting relaxation, balance, and overall well-being through guided energy practices.",
  },
  {
    icon: Brain,
    title: "Energy Awareness Sessions",
    description: "Sessions that help participants understand personal energy awareness, grounding practices, and emotional balance for everyday well-being.",
  },
  {
    icon: Sun,
    title: "Mindful Living Guidance",
    description: "Programs introducing practical mindful living techniques to support stress management, awareness, and healthier lifestyle habits.",
  },
  {
    icon: Users,
    title: "Wellness Workshops",
    description: "Interactive workshops conducted for colleges, schools, organizations, and community groups focusing on emotional wellness and creative engagement.",
  },
  {
    icon: GraduationCap,
    title: "Facilitator & Educator Training",
    description: "Training programs for teachers, facilitators, and youth leaders to conduct safe, non-clinical expressive sessions.",
  },
  {
    icon: Target,
    title: "Customized Group Programs",
    description: "Tailor-made wellness and expressive programs designed for institutions, student groups, and communities based on specific needs.",
  },
  {
    icon: Wifi,
    title: "Online Sessions & Programs",
    description: "Online workshops and training programs accessible for remote participants.",
  },
  {
    icon: BookOpen,
    title: "Learning Materials & Activity Resources",
    description: "Study materials, activity guides, and reflective resources for learners and facilitators.",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Ganora Holistic Hub offers non-clinical holistic wellness and expressive learning programs focused on emotional awareness, creativity, and mindful living.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-start gap-3">
                    <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Alert className="border-primary/20 bg-primary/5">
          <AlertCircle className="h-5 w-5 text-primary" />
          <AlertDescription className="text-foreground ml-2">
            <strong>Important:</strong> All programs offered by Ganora Holistic Hub are non-clinical wellness and educational services and do not provide medical or psychological treatment.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};

export default Services;
