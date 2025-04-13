import React from "react";
import blockchain1 from "../assets/blockchain1.jpg";
import blockchain2 from "../assets/blockchain2.jpg";
import blockchain3 from "../assets/blockchain3.jpg";
import BlogCard from "../Components/BlogCard";

export const BlogSection = () => {
  const blogs = [
    {
      title: "What is the Blockchain?",
      description:
        "Explore the fundamentals of blockchain technology and understand how it powers decentralized systems. Learn why it's considered the backbone of cryptocurrencies and the future of secure digital transactions.",
      imgUrl: blockchain1,
    },
    {
      title: "How to use Our App",
      description:
        "Get started with our app and unlock the power of decentralized finance. Follow our step-by-step guide to swap tokens, provide liquidity, and manage your wallet effortlessly.",
      imgUrl: blockchain2,
    },
    {
      title: "What is the LP token and Balance?",
      description:
        "Discover the role of LP tokens in liquidity pools and how they represent your share of the pool. Learn how to track your balances and maximize your rewards in the DeFi ecosystem.",
      imgUrl: blockchain3,
    },
  ];
  return (
    <div className="blog-section-container">
      <div className="blog-section-header">
        <h1>
          Learn More about <span className="higlighted">DEFI</span>
        </h1>
        <button className="secondary">View More</button>
      </div>
      <div className="blogs-container">
        {blogs.map((blog, index) => {
          return (
            <BlogCard
              key={index}
              title={blog.title}
              description={blog.description}
              imgUrl={blog.imgUrl}
            />
          );
        })}
      </div>
    </div>
  );
};
