import React from 'react';
import img from '../../assets/doodhman.png';

const Spinner = () => {
  return (
    <div
      className="flex items-center justify-center"
    >
      <div className="relative w-[10rem] h-[10rem]">
        {/* Outer soft expanding ring */}
        <div className="absolute inset-[1rem] rounded-full border-8 border-[#ff8b25] opacity-[1] animate-ping"></div>

        
        {/* Central Image (natural integration) */}
        <img
          src={img}
          alt="spinner center"
          className="absolute top-[4rem] left-[4rem] w-[5rem] h-[5rem] object-contain transform -translate-1/2 -translate-1/2 drop-shadow-[0_0_6px_#f0c9a6] animate-ping"
        />
        <img
          src={img}
          alt="spinner center"
          className="absolute top-[4rem] left-[4rem] w-[5rem] h-[5rem] object-contain transform -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_6px_#f0c9a6] animate-ping"
        />
        <img
          src={img}
          alt="spinner center"
          className="absolute top-[4rem] left-[4rem] w-[5rem] h-[5rem] object-contain transform -translate-y-1/2 -translate-x-1/2 drop-shadow-[0_0_6px_#f0c9a6] animate-ping"
        />
      </div>
    </div>
  );
};

export default Spinner;
