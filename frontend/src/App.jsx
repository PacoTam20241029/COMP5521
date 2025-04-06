import './App.css';
import Header from './Components/header';
import HeroSection from './Components/HeroSection';
import DailyStats from './Components/DailyStats';
import { Card } from './Components/Card';
import insurance1 from "./assets/insurance1.svg";
import wallet1 from "./assets/wallet1.svg";
import profit1 from "./assets/profit1.svg";
import SocialMediaPromotion from './Components/SocialMediaPromotion';
import DevSection from './Components/DevSection';
import { BlogSection } from './Components/BlogSection';
import Footer from './Components/Footer1';
import Card1 from './Components/Card1'
import Homepages from './Components/Homepages';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const features = [
    {
      src: wallet1,
      title: "Value",
      description: "Swap from your own wallet. Be your own bank. No centralized bridges or wrapping assets",
    },
    {
      src: profit1,
      title: "Yield",
      description: "Provide Liquidity and Earn Yield on your Native Assets with Impermanent Loss Protection",
    },
    {
      src: insurance1,
      title: "Insurance",
      description: "Protect your assets with decentralized insurance solutions",
    },
  ];


  return (
    <Router>
    <div className="home">
      <Header />
      <Routes>
        <Route path="/card" element={<Card1 />} />
        <Route path="/" element={<Homepages />} />
      </Routes>

      <Footer />
    </div>
    </Router>
  );
}

export default App;