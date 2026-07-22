import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ProductShowcase from "./Components/HeroProductShowcase";
import SiteIntro from "./Components/SiteIntro";
import AboutSection from "./Components/Aboutsection";
import DesignSection from "./Components/designsection";
import ProductsSection from "./Components/Productssection";
import SystemSection from "./Components/Systemsection";
import ContactSection from "./Components/Contactsection";
import ProductsPage from "./Components/ProductsPage";
import Footer from "./Components/Footer";
import "./index.css";

function HomePage() {
  return (
    <>
      <Navbar />
      <SiteIntro />
      <ProductShowcase />
      <AboutSection />
      <DesignSection />
      <ProductsSection />
      <SystemSection />
      <ContactSection />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <div className="bg-white font-body overflow-x-clip">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </div>
  );
}
