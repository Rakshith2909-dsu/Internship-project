import { useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/WhatsApp Image 2026-02-22 at 9.48.48 AM.jpeg";
import gallery5 from "@/assets/WhatsApp Image 2026-02-22 at 9.47.10 AM.jpeg";
import gallery6 from "@/assets/WhatsApp Image 2026-02-22 at 9.47.11 AM.jpeg";
import gallery7 from "@/assets/WhatsApp Image 2026-02-22 at 9.47.10 AM (1).jpeg";
import gallery8 from "@/assets/WhatsApp Image 2026-02-22 at 9.47.09 AM.jpeg";
import gallery9 from "@/assets/WhatsApp Image 2026-02-22 at 9.47.09 AM (2).jpeg";
import gallery10 from "@/assets/WhatsApp Image 2026-02-22 at 9.48.49 AM.jpeg";
import gallery11 from "@/assets/WhatsApp Image 2026-02-22 at 9.48.48 AM (1).jpeg";
import gallery12 from "@/assets/WhatsApp Image 2026-02-22 at 9.47.09 AM (1).jpeg";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { X } from "lucide-react";

const gallerySections = [
  {
    title: "Online Sessions",
    items: [
      { image: gallery4, caption: "Virtual pranic healing presentation" },
      { image: gallery12, caption: "Online group healing session" },
      { image: gallery11, caption: "Participant testimonials & feedback" },
    ]
  },
  {
    title: "Workshop & Classroom",
    items: [
      { image: gallery5, caption: "Workshop environment" },
      { image: gallery6, caption: "Interactive healing demonstration" },
      { image: gallery7, caption: "Guided meditation practice" },
    ]
  },
  {
    title: "Healing Spaces",
    items: [
      { image: gallery1, caption: "Energy in motion" },
      { image: gallery2, caption: "Moments of awareness" },
      { image: gallery3, caption: "Peaceful healing space" },
    ]
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<{ image: string; caption: string } | null>(null);

  return (
    <>
      <section id="gallery" className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Gallery</h2>
            <p className="text-lg text-muted-foreground">
              Capturing the essence of healing and tranquility
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gallerySections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="space-y-4">
                <h3 className="text-xl md:text-2xl font-semibold text-foreground text-center pb-4 border-b-2 border-primary/20">
                  {section.title}
                </h3>
                <div className="space-y-4">
                  {section.items.map((item, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg aspect-square cursor-pointer"
                      onClick={() => setSelectedImage(item)}
                    >
                      <img
                        src={item.image}
                        alt={item.caption}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <p className="text-background text-sm font-medium">{item.caption}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 overflow-auto bg-black/95 border-none">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          {selectedImage && (
            <div className="flex flex-col items-center justify-center p-4">
              <img
                src={selectedImage.image}
                alt={selectedImage.caption}
                className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
              />
              <p className="text-white text-lg font-medium mt-4 text-center px-4 pb-2">
                {selectedImage.caption}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Gallery;
