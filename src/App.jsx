import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/Home";
import AboutPage from "./Pages/About";
import ProductsPage from "./Pages/Products";
import ContactPage from "./Pages/Contact";
import "./index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-white text-brand-black">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
