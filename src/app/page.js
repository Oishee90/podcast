import HomePage from "../component/home/Home";
import React from "react";

export default function Home() {
  // const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    
    <div
      className="bg-black"
      style={{ position: "relative", width: "100%", height: "100vh" }}
    >
      <HomePage />
    </div>
  );
}
