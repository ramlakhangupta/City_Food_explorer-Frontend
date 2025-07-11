import React from "react";
import { motion } from "framer-motion";
import doodhMan from "../../../assets/doodhman.png";
import foodCart from "../../../assets/foodCart.png";

const FoodAnimation = () => {
  return (
    <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] lg:h-screen bg-gray-100 flex items-end justify-center overflow-hidden sm:ml-[5rem]">

      {/* Doodh Man Animation */}
      {/* Doodh Man Animation */}
      <motion.img
        src={doodhMan}
        alt="Doodh Man"
        className="
          hidden lg:block
          absolute 
          w-[10rem] sm:w-[15rem] md:w-[20rem] lg:w-[23rem]
          ml-[-4rem] sm:ml-[-10rem] md:ml-[-25rem] lg:ml-[-38rem]
          mb-[10rem] sm:mb-[13rem] md:mb-[15rem] lg:mb-[17rem]
          h-auto
        "
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
      />


      {/* Food Truck Animation */}
      <motion.img
        src={foodCart}
        alt="Food Truck"
        className="
          absolute 
          top-0 
          p-2 sm:p-4 md:p-6 lg:p-7
          w-[18rem] sm:w-[25rem] md:w-[30rem] lg:w-[38rem]
          mr-[-4rem] sm:mr-[-8rem] md:mr-[-10rem] lg:mr-[-15rem]
          h-auto
        "
        initial={{ opacity: 0.9 }}
        animate={{ opacity: 1, scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror" }}
      />
    </div>
  );
};

export default FoodAnimation;
