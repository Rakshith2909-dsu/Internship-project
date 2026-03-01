import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const upcomingSessions = [
  {
    date: "March 15, 2026",
    time: "10:00 AM - 11:30 AM",
    type: "Pranic Healing Session",
  },
  {
    date: "March 18, 2026",
    time: "4:00 PM - 5:30 PM",
    type: "Energy Awareness Workshop",
  },
  {
    date: "March 22, 2026",
    time: "6:00 PM - 7:30 PM",
    type: "Mindful Living Group Session",
  },
];

const Sessions = () => {
  const handleRegister = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="sessions" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Join Our Upcoming Sessions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience healing and awareness in real time
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {upcomingSessions.map((session, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card"
            >
              <CardContent className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground">
                  {session.type}
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar size={18} />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={18} />
                    <span>{session.time}</span>
                  </div>
                </div>
                <Button
                  onClick={handleRegister}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Register
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sessions;
