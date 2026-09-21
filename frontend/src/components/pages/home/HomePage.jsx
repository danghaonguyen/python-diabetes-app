import { useEffect } from "react";
import HeaderTop from "../layout/HeaderTop";
import Navbar from "../layout/Navbar";
import Slider from "./Slider";
import Features from "./Features";
import About from "./About";
import Intrust from "./Intrust";
import Introduction from "./Introduction";
import Footer from "../layout/Footer";
import "./Home.css";

const HomePage = () => {
  useEffect(() => {
    const scrollToId = localStorage.getItem("scrollTo");
    if (scrollToId) {
      setTimeout(() => {
        const element = document.getElementById(scrollToId);
        if (element) element.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("scrollTo");
      }, 300);
    }
  }, []);

  return (
    <div className="home-page">
      <HeaderTop />
      <Navbar />
      <div id="slider"><Slider /></div>
      <div id="features"><Features /></div>
      <div id="about"><About /></div>
      <div id="intrust"><Intrust /></div>
      <div id="introduction"><Introduction /></div>
      <Footer />
    </div>
  );
};

export default HomePage;
