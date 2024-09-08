import React from "react";
import github from "../../assets/github.svg";
import './Logo.css';
const Logo = () => {
  return (
    <div className="search_user">
      <img src={github} alt="GitHub Logo" className="github_icon" />
    </div>
  );
};

export default Logo;
