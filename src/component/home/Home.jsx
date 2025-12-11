"use client";
import React, { useState, useEffect } from "react";
import Banner from "./Banner";

const Home = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
   
    setMounted(true);
  }, []);

  if (!mounted) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Banner />
    </div>
  );
};

export default Home;
