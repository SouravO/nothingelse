import { useEffect, useMemo, useState } from "react";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import HomePage from "./Pages/Home";
import AboutPage from "./Pages/About";
import ProductsPage from "./Pages/Products";
import ContactPage from "./Pages/Contact";
import "./index.css";

const routes = {
  "/": HomePage,
  "/about": AboutPage,
  "/products": ProductsPage,
  "/contact": ContactPage,
};

function normalizePath(pathname) {
  if (!pathname || pathname === "/index.html") return "/";
  return pathname.endsWith("/") && pathname !== "/"
    ? pathname.slice(0, -1)
    : pathname;
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname));
      window.scrollTo({ top: 0 });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(href) {
    const nextPath = normalizePath(href);

    if (nextPath !== path) {
      window.history.pushState({}, "", nextPath);
      setPath(nextPath);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const Page = useMemo(() => routes[path] || HomePage, [path]);

  return (
    <div className="min-h-screen bg-white text-brand-black">
      <Navbar currentPath={path} onNavigate={navigate} />
      <main>
        <Page onNavigate={navigate} />
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}
