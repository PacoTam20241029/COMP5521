import React from "react";
import "./About.css"; // Optional: Add a CSS file for styling

const About = () => {
  return (
    <div className="about-container">
      <h1>About Crypto Hub</h1>
      <p>
        Welcome to <strong>Crypto Hub</strong>, your one-stop platform for decentralized finance (DeFi). 
        Our application allows you to seamlessly swap tokens, provide liquidity, and manage your wallet balances.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Swap tokens with ease and security.</li>
        <li>Provide liquidity to earn rewards.</li>
        <li>Track your wallet balances in real-time.</li>
        <li>Connect your wallet with a single click.</li>
      </ul>
      <h2>Our Mission</h2>
      <p>
        At <strong>Crypto Hub</strong>, we aim to empower users by providing tools to interact with decentralized finance protocols. 
        Whether you're a beginner or an experienced user, our platform is built to cater to your needs.
      </p>
      <h2>Contact Us</h2>
      <p>
        Have questions or feedback? Feel free to reach out to us at{" "}
        <a href="mailto:support@cryptohub.com">support@cryptohub.com</a>.
      </p>
    </div>
  );
};

export default About;