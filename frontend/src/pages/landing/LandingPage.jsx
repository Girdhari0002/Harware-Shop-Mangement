import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import LoginButtons from "./LoginButtons";
import InvoiceVerification from "./InvoiceVerification";
import FeaturesSection from "./FeaturesSection";
import HowItWorks from "./HowItWorks";
import BenefitsSection from "./BenefitsSection";
import CTASection from "./CTASection";
import Footer from "./Footer";

const LandingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <LoginButtons />
        <InvoiceVerification />
        <FeaturesSection />
        <HowItWorks />
        <BenefitsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;