/* global tns, WOW */
(function () {
  "use strict";

  //===== Preloader
  window.onload = function () {
    window.setTimeout(fadeout, 500);
  };

  function fadeout() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
      preloader.style.opacity = '0';
      preloader.style.display = 'none';
    }
  }

  //===== Sticky navbar & scroll-top
  window.onscroll = function () {
    const header_navbar = document.querySelector(".navbar-area");
    if (header_navbar) {
      const sticky = header_navbar.offsetTop;
      if (window.pageYOffset > sticky) {
        header_navbar.classList.add("sticky");
      } else {
        header_navbar.classList.remove("sticky");
      }
    }

    const backToTop = document.querySelector(".scroll-top");
    if (backToTop) {
      if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
        backToTop.style.display = "block";
      } else {
        backToTop.style.display = "none";
      }
    }
  };

  //======= Tiny Slider
  if (typeof tns === "function") {
    const slider = document.querySelector(".slider-active");
    if (slider) {
      tns({
        container: '.slider-active',
        items: 1,
        slideBy: 'page',
        autoplay: true,
        mouseDrag: true,
        gutter: 0,
        nav: true,
        controls: false,
        autoplayButtonOutput: false,
      });
    }
  }

  //===== Smooth scroll
  const pageLinks = document.querySelectorAll('.page-scroll');
  pageLinks.forEach(elem => {
    elem.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(elem.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });

  //===== Menu active on scroll
  function onScroll() {
    const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    pageLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      const offsetTop = section ? section.offsetTop : 0;
      const offsetHeight = section ? section.offsetHeight : 0;

      if (scrollPos + 73 >= offsetTop && scrollPos + 73 < offsetTop + offsetHeight) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll);

  //===== Close mobile nav on link click
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  pageLinks.forEach(e => {
    e.addEventListener("click", () => {
      if (navbarToggler && navbarCollapse) {
        navbarToggler.classList.remove("active");
        navbarCollapse.classList.remove("show");
      }
    });
  });

  if (navbarToggler) {
    navbarToggler.addEventListener("click", function () {
      navbarToggler.classList.toggle("active");
    });
  }

  //===== WOW Animation
  if (typeof WOW === "function") {
    new WOW().init();
  }

})();
