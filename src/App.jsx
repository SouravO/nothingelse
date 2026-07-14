import Navbar from "./Components/Navbar";
import HomeSection from "./Components/Homesection";
import AboutSection from "./Components/Aboutsection";
import ProductsSection from "./Components/Productssection";
import SystemSection from "./Components/Systemsection";
import PresenceSection from "./Components/Presencesection";
import ContactSection from "./Components/Contactsection";
import "./index.css";

export default function App() {
  return (
    <div className="bg-white font-body overflow-x-clip">
      <Navbar />
      <HomeSection />
      <AboutSection />
      <ProductsSection />
      <SystemSection />
      <PresenceSection />
      <ContactSection />
    </div>
  );
}