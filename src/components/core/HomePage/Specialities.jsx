import React from 'react';

const Specialities = () => {
  return (
    <div className="relative w-full px-4">
      <div
        className='
          bg-sindoor-gradient 
          text-white uppercase 
          py-4 px-5 
          rounded-3xl 
          flex flex-col lg:flex-row 
          items-center 
          justify-center 
          gap-3

          // Desktop styles only
          lg:py-5 lg:pl-7 
          lg:absolute 
          lg:left-[50%] 
          lg:translate-x-[-20%] 
          lg:translate-y-[-70%] 
          lg:mt-[-8rem]
          mt-4
        '
      >

        <div className='
          flex flex-col lg:flex-row 
          gap-3 lg:gap-5 
          items-center 
          lg:border-r 
          border-caribbeangreen-300 
          px-3 lg:px-7
        '>
          <p className='text-sm sm:text-base text-center lg:text-start text-[#3c3838d7] font-semibold'>
            The Best Flavors are found{" "}
            <span className="text-xl sm:text-2xl lg:text-3xl text-[#444441] font-bold">Not</span> in Menus,{" "}
            <span className="text-xl sm:text-2xl lg:text-3xl text-[#444441] font-bold">But On The Streets !</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Specialities;
