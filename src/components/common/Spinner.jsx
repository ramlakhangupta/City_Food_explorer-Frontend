// components/Spinner.jsx
import React from "react";

const Spinner = ({ color = '#f9d3b2', size = 15, speed = 1.3 }) => {
  const loaderStyle = {
    color: color,
    fontSize: `${size}px`, // Controls overall size through em units
    animationDuration: `${speed}s`
  };

  return (
    <div className="w-[1rem] h-[1rem] absolute loader flex justify-center items-center" style={loaderStyle}>
      <style jsx>{`
        .loader {
          width: 1em;
          height: 1em;
          border-radius: 50%;
          position: relative;
          text-indent: -9999em;
          animation: mulShdSpin ${speed}s infinite linear;
          transform: translateZ(0);
        }

        @keyframes mulShdSpin {
          0%, 100% {
            box-shadow: 0 -3em 0 0.2em currentColor, 
            2em -2em 0 0em currentColor, 
            3em 0 0 -1em currentColor, 
            2em 2em 0 -1em currentColor, 
            0 3em 0 -1em currentColor, 
            -2em 2em 0 -1em currentColor, 
            -3em 0 0 -1em currentColor, 
            -2em -2em 0 0 currentColor;
          }
          12.5% {
            box-shadow: 0 -3em 0 0 currentColor, 
            2em -2em 0 0.2em currentColor, 
            3em 0 0 0 currentColor, 
            2em 2em 0 -1em currentColor, 
            0 3em 0 -1em currentColor, 
            -2em 2em 0 -1em currentColor, 
            -3em 0 0 -1em currentColor, 
            -2em -2em 0 -1em currentColor;
          }
          25% {
            box-shadow: 0 -3em 0 -0.5em currentColor, 
            2em -2em 0 0 currentColor, 
            3em 0 0 0.2em currentColor, 
            2em 2em 0 0 currentColor, 
            0 3em 0 -1em currentColor, 
            -2em 2em 0 -1em currentColor, 
            -3em 0 0 -1em currentColor, 
            -2em -2em 0 -1em currentColor;
          }
          37.5% {
            box-shadow: 0 -3em 0 -1em currentColor, 
            2em -2em 0 -1em currentColor,
            3em 0em 0 0 currentColor, 
            2em 2em 0 0.2em currentColor, 
            0 3em 0 0em currentColor, 
            -2em 2em 0 -1em currentColor, 
            -3em 0em 0 -1em currentColor, 
            -2em -2em 0 -1em currentColor;
          }
          50% {
            box-shadow: 0 -3em 0 -1em currentColor, 
            2em -2em 0 -1em currentColor,
            3em 0 0 -1em currentColor, 
            2em 2em 0 0em currentColor, 
            0 3em 0 0.2em currentColor, 
            -2em 2em 0 0 currentColor, 
            -3em 0em 0 -1em currentColor, 
            -2em -2em 0 -1em currentColor;
          }
          62.5% {
            box-shadow: 0 -3em 0 -1em currentColor, 
            2em -2em 0 -1em currentColor,
            3em 0 0 -1em currentColor, 
            2em 2em 0 -1em currentColor, 
            0 3em 0 0 currentColor, 
            -2em 2em 0 0.2em currentColor, 
            -3em 0 0 0 currentColor, 
            -2em -2em 0 -1em currentColor;
          }
          75% {
            box-shadow: 0em -3em 0 -1em currentColor, 
            2em -2em 0 -1em currentColor, 
            3em 0em 0 -1em currentColor, 
            2em 2em 0 -1em currentColor, 
            0 3em 0 -1em currentColor, 
            -2em 2em 0 0 currentColor, 
            -3em 0em 0 0.2em currentColor, 
            -2em -2em 0 0 currentColor;
          }
          87.5% {
            box-shadow: 0em -3em 0 0 currentColor, 
            2em -2em 0 -1em currentColor, 
            3em 0 0 -1em currentColor, 
            2em 2em 0 -1em currentColor, 
            0 3em 0 -1em currentColor, 
            -2em 2em 0 0 currentColor, 
            -3em 0em 0 0 currentColor, 
            -2em -2em 0 0.2em currentColor;
          }
        }
      `}</style>
    </div>
  );
};


export default Spinner;