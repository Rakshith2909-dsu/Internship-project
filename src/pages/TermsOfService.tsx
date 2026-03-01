import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FileText } from "lucide-react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
            <FileText className="text-primary" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 18, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using the Ganora Holistic Hub website and services, you accept and agree to be bound 
              by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Services Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              Ganora Holistic Hub provides energy healing services, Pranic Healing sessions, wellness workshops, and 
              related educational content. Our services are complementary wellness modalities and are not a substitute 
              for professional medical advice, diagnosis, or treatment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To book sessions and access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Booking and Payment Terms</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">4.1 First Session</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your first healing session is provided free of charge. Each user is entitled to one free first session.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4.2 Subsequent Sessions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All sessions after your first are charged at ₹500 per session. Payment must be made at the time of booking 
                  through our secure payment gateway (Razorpay).
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4.3 Payment Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All payments are processed securely through Razorpay. We do not store complete payment card details. 
                  By making a payment, you agree to Razorpay's terms and conditions.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">4.4 Booking Confirmation</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your booking is confirmed once payment is successfully processed. You will receive a confirmation email 
                  with session details.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cancellation and Refund Policy</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">5.1 Cancellation by User</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>24+ hours notice:</strong> Full refund</li>
                  <li><strong>12-24 hours notice:</strong> 50% refund</li>
                  <li><strong>Less than 12 hours:</strong> No refund</li>
                  <li><strong>No-show:</strong> No refund</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">5.2 Cancellation by Us</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If we need to cancel your session due to unforeseen circumstances, you will receive a full refund or 
                  the option to reschedule at no additional cost.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">5.3 Refund Processing</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Approved refunds will be processed within 5-7 business days to the original payment method.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Medical Disclaimer</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 space-y-4">
              <p className="text-muted-foreground leading-relaxed font-semibold">
                IMPORTANT MEDICAL DISCLAIMER:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Pranic Healing is a complementary wellness modality, NOT a medical treatment</li>
                <li>Our services do not replace conventional medical care or professional medical advice</li>
                <li>We do not diagnose, treat, cure, or prevent any disease</li>
                <li>Always consult with qualified healthcare professionals for medical conditions</li>
                <li>Continue taking prescribed medications unless directed otherwise by your doctor</li>
                <li>Do not discontinue medical treatment based on energy healing sessions</li>
                <li>Results may vary and are not guaranteed</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. User Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              As a user of our services, you agree to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide honest information about your health and wellness goals</li>
              <li>Inform us of any medical conditions or concerns</li>
              <li>Arrive on time for scheduled sessions</li>
              <li>Respect our practitioners and staff</li>
              <li>Not use our services for any unlawful purpose</li>
              <li>Not share your account credentials with others</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, is the property of 
              Ganora Holistic Hub and is protected by copyright and intellectual property laws. You may not reproduce, 
              distribute, or create derivative works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, Ganora Holistic Hub shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or 
              indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless Ganora Holistic Hub, its officers, directors, employees, and agents 
              from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of 
              our services or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify users of any material 
              changes by posting the updated terms on our website. Your continued use of our services after such changes 
              constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate or suspend your account and access to our services at any time, without 
              prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third 
              parties, or for any other reason at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
              from these Terms or your use of our services shall be subject to the exclusive jurisdiction of the courts 
              in [Your City/State], India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">14. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 space-y-2 text-muted-foreground">
              <p><strong>Email:</strong> ganoraholistichub@gmail.com</p>
              <p><strong>WhatsApp:</strong> +91 7676655152</p>
              <p><strong>Instagram:</strong> @ganora_holistic_hub</p>
            </div>
          </section>

          <section className="bg-muted/30 rounded-lg p-6">
            <p className="text-muted-foreground leading-relaxed">
              <strong>By using Ganora Holistic Hub services, you acknowledge that you have read, understood, and agree 
              to be bound by these Terms of Service.</strong>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;
