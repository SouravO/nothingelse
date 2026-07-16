import Navbar from "./Components/Navbar";
import HomeSection from "./Components/Homesection";
import ProductShowcase from "./Components/HeroProductShowcase";
import SiteIntro from "./Components/SiteIntro";
import AboutSection from "./Components/Aboutsection";
import DesignSection from "./Components/designsection";
import ProductsSection from "./Components/Productssection";
import SystemSection from "./Components/Systemsection";
import PresenceSection from "./Components/Presencesection";
import ContactSection from "./Components/Contactsection";
import "./index.css";

export default function App() {
  return (
    <div className="bg-white font-body overflow-x-clip">
      <Navbar />
      <SiteIntro />
      <ProductShowcase />
      <AboutSection />
      <DesignSection />
      <ProductsSection />
      <SystemSection />
      <PresenceSection />
      <ContactSection />
    </div>
  );
}