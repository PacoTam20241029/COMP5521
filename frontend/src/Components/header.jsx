import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Ensure this is the correct import for your MenuIcon
import "./header.css"; // Import your CSS file for styling
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import HomeIcon from '@mui/icons-material/Home';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InfoIcon from '@mui/icons-material/Info';
import BookIcon from '@mui/icons-material/Book';


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
          DEFI
        </Link>
      </div>
              {/* Navigation Menu */}
      <nav className="menu">
        <div className="menu-links">
          <Link to="/" className="menu-item">
            <HomeIcon fontSize="large" /> Home
          </Link>
          <Link to="/card" className="menu-item">
            <ArrowForwardIcon fontSize="large" /> App
          </Link>
          <Link to="/about" className="menu-item">
            <InfoIcon fontSize="large" /> About
          </Link>
          <Link to="/learn" className="menu-item">
            <BookIcon fontSize="large" /> Learn
            </Link>
        </div>
      </nav>
      <div className="social-media">
        <span>Follow Us:</span>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FacebookIcon fontSize="large" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <InstagramIcon fontSize="large" />
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon fontSize="large" />
        </a>
      </div>
      </div>
      {isExpanded && (
        <div className="menu-overlay">
          <div className="menu-links">
            <Link to="/"><HomeIcon fontSize="large"/> HomePage</Link>
            <Link to="/card"><ArrowForwardIcon fontSize="large"/> App</Link>
            <Link to="/about"><InfoIcon fontSize="large"/> About</Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;