import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Ensure this is the correct import for your MenuIcon
import "./header.css"; // Import your CSS file for styling

const Header = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  };

  return (
    <>
      <div className="header-container">
      <div className="logo">
        <Link to="/" className="logo-text" >
          TOKSWAP
        </Link>
      </div>
        <div className="menu">
          <div className="menu-links">
            <Link to="/card">App</Link>
            <Link to="/">Products</Link>
            <Link to="/">Build</Link>
            <Link to="/">Careers</Link>
            <Link to="/">About</Link>
          </div>
        </div>
        <div className="wallet-btn">
          {/* Use Link for navigation */}
          <Link to="/card">
            <button className="primary">Enter App</button>
          </Link>
        </div>
        <button className="hamburger" onClick={toggleExpanded}>
          <MenuIcon />
        </button>
      </div>
      {isExpanded && (
        <div className="menu-overlay">
          <div className="menu-links">
            <Link to="/card">App</Link>
            <Link to="/">Products</Link>
            <Link to="/">Build</Link>
            <Link to="/">Careers</Link>
            <Link to="/">About</Link>
            <Link to="/">Enter App</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;