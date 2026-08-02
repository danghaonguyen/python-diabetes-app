import React, { useEffect } from 'react';
import HeaderTop from './HeaderTop';
import Navbar from './Navbar';
import Slider from './Slider';
import Features from './Features';
import About from './About';
import Intrust from './Intrust';
import Introduction from './Introduction';
/* import Blog from './Blog';
import Contact from './Contact'; */
import Footer from './Footer';

const HomePage = () => {
  useEffect(() => {
    const scrollToId = localStorage.getItem("scrollTo");
    if (scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(scrollToId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
        localStorage.removeItem("scrollTo");
      }, 300); // đợi cho các component render xong
    }
  }, []);

  return (
    <div>
      <HeaderTop />
      <Navbar />
      <div id="slider"><Slider /></div>
      <div id="features"><Features /></div>
      <div id="about"><About /></div>
      <div id="intrust"><Intrust /></div>
      <div id="introduction"><Introduction /></div>
  {/*     <div id="blog"><Blog /></div>
      <div id="contact"><Contact /></div> */}
      <Footer />
    </div>
  );
};

export default HomePage;
