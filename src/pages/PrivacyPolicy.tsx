import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Shield } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <Shield className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 18, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              Welcome to Ganora Holistic Hub. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy will inform you about how we look after your personal data when you visit our website 
              and tell you about your privacy rights and how the law protects you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We may collect, use, store and transfer different kinds of personal data about you:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Identity Data:</strong> First name, last name, username</li>
              <li><strong>Contact Data:</strong> Email address, telephone number</li>
              <li><strong>Financial Data:</strong> Payment card details (processed securely via Razorpay)</li>
              <li><strong>Transaction Data:</strong> Details about payments and bookings</li>
              <li><strong>Technical Data:</strong> IP address, browser type, time zone, device information</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services</li>
              <li><strong>Health Data:</strong> Information you provide about your wellness goals and conditions (optional)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We will only use your personal data when the law allows us to. Most commonly, we will use your 
              personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>To provide and manage your bookings and appointments</li>
              <li>To process your payments securely</li>
              <li>To send you appointment reminders and confirmations</li>
              <li>To communicate with you about our services</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations</li>
              <li>To send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally 
              lost, used or accessed in an unauthorized way, altered or disclosed. All payment information is processed 
              through Razorpay's secure payment gateway and we do not store complete payment card details on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, 
              including for the purposes of satisfying any legal, accounting, or reporting requirements. Account data is 
              retained as long as your account is active. Booking and payment records are retained for 7 years for legal 
              and tax purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Under data protection laws, you have rights including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Right to access:</strong> Request copies of your personal data</li>
              <li><strong>Right to correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Right to erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to restrict processing:</strong> Request restriction of processing your data</li>
              <li><strong>Right to data portability:</strong> Request transfer of your data</li>
              <li><strong>Right to object:</strong> Object to processing of your personal data</li>
              <li><strong>Right to withdraw consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our website uses cookies to distinguish you from other users and to provide you with a better experience. 
              Cookies help us analyze web traffic and improve our services. You can set your browser to refuse cookies, 
              but this may limit your use of certain features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use trusted third-party services to help us provide our services:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
              <li><strong>Supabase:</strong> Database and authentication services</li>
              <li><strong>Razorpay:</strong> Payment processing</li>
              <li><strong>Email Service Providers:</strong> For sending transactional and promotional emails</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These third parties have their own privacy policies and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal 
              information from children. If you become aware that a child has provided us with personal data, please 
              contact us so we can delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the 
              new privacy policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this privacy policy or our privacy practices, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> ganoraholistichub@gmail.com</p>
              <p><strong>WhatsApp:</strong> +91 7676655152</p>
              <p><strong>Instagram:</strong> @ganora_holistic_hub</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
