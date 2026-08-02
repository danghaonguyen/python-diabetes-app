import React from "react";
import "./css/HeaderTop.css";

const HeaderTop = () => {
  return (
    <div className="header-top" id="home">
      <div className="header-container">
        <div className="header-left">
          <a href="tel:+840384611449">
            <i className="lni lni-phone"></i> +84 0384 611 449
          </a>
          <span className="divider">|</span>
          <a href="mailto:vinaihn@gmail.com">
            <i className="lni lni-envelope"></i> vinaihn@gmail.com
          </a>
        </div>
        <div className="header-right">
          <a href="https://www.facebook.com/haonguyenhype/" target="_blank" rel="noreferrer">
            <i className="lni lni-facebook-filled"></i>
          </a>
          <a href="https://github.com/danghaonguyen" target="_blank" rel="noreferrer">
            <i className="lni lni-github-original"></i>
          </a>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;
