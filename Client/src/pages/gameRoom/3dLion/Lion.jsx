import React, { useEffect } from "react";
import "./reset.css";
import "./style.css";

const Lion = () => {
  useEffect(() => {
    // Dynamically load the Three.js and OrbitControls scripts
    const scriptThree = document.createElement("script");
    scriptThree.src =
      "http://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js";
    scriptThree.async = true;
    scriptThree.onload = () => {
      console.log("Three.js loaded");
    };
    document.body.appendChild(scriptThree);

    const scriptOrbitControls = document.createElement("script");
    scriptOrbitControls.src =
      "https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/OrbitControls.js";
    scriptOrbitControls.async = true;
    scriptOrbitControls.onload = () => {
      console.log("OrbitControls.js loaded");
    };
    document.body.appendChild(scriptOrbitControls);

    // Load the custom index.js script for the animation logic
    // import("./index.js")
    <script></script>;

    // Cleanup on component unmount
    return () => {
      document.body.removeChild(scriptThree);
      document.body.removeChild(scriptOrbitControls);
    };
  }, []);

  return (
    <div>
      <div id="world"></div>
      <div id="instructions">
        Press and drag to make wind
        <br />
        <span className="lightInstructions">
          The lion will surely appreciate
        </span>
      </div>
    </div>
  );
};

export default Lion;
