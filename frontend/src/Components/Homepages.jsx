import '../App.css';
import HeroSection from '../Components/HeroSection';
import DailyStats from '../Components/DailyStats';
import { Card } from '../Components/Card';
import insurance1 from "../assets/insurance1.svg";
import wallet1 from "../assets/wallet1.svg";
import profit1 from "../assets/profit1.svg";
import SocialMediaPromotion from '../Components/SocialMediaPromotion';
import DevSection from '../Components/DevSection';
import { BlogSection } from '../Components/BlogSection';

function App() {
  const features = [
    {
      src: wallet1,
      title: "Value",
      description: "Swap tokens directly from your wallet and take full control of your assets. No intermediaries, no centralized bridges—just true financial freedom",
    },
    {
      src: profit1,
      title: "Yield",
      description: "Earn passive income by providing liquidity. Maximize your returns with native assets and enjoy protection against impermanent loss",
    },
    {
      src: insurance1,
      title: "Insurance",
      description: "Safeguard your investments with decentralized insurance solutions designed to protect your assets in the DeFi ecosystem",
    },
  ];


  return (

    <div className="home">
        <HeroSection />
        <DailyStats />
        <div className="features-list-container">
            {features.map((feature, index) => (
              <Card key={index} title={feature.title} imgUrl={feature.src}>
                <p>{feature.description}</p>
              </Card>
            ))}
          </div>
          <DevSection />
          <SocialMediaPromotion />
          <BlogSection />
    </div>
  );
}

export default App;