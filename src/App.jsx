import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import ProductShowcase from "./Components/HeroProductShowcase";
import FallingProducts from "./Components/Fallingproducts";
import SiteIntro from "./Components/SiteIntro";
import AboutSection from "./Components/Aboutsection";
import DesignSection from "./Components/designsection";
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
      <FallingProducts />
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
