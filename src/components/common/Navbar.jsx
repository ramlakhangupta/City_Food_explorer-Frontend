import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import cityFoodExploreImg from "../../assets/Cityfoodexplorelogo.png";
import Cookies from 'universal-cookie';
import { FaUserCog, FaTachometerAlt, FaSignOutAlt, FaBars } from "react-icons/fa";

const cookies = new Cookies();

const Navbar = () => {
  const user = cookies.get('user') || null;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState('top');
  const [lastScrollY, setLastScrollY] = useState(0);

  const matchRoute = (route) => location.pathname === route;

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const controlNavbar = () => {
    if (window.scrollY > 200) {
      window.scrollY > lastScrollY ? setShowNavbar('hide') : setShowNavbar('show');
    } else {
      setShowNavbar('top');
    }
    setLastScrollY(window.scrollY);
  };

  return (
    <nav className={`relative z-[60] h-14 w-full sm:w-11/12 flex items-center mt-3 px-4 sm:px-0 mx-auto ${showNavbar}`}>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden mr-2 text-white text-xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <FaBars />
      </button>

      {/* Logo Section */}
      <div className="w-auto md:w-[20%] flex items-center">
        <Link to="/" className="flex items-center gap-2">
        <img
          src={cityFoodExploreImg}
          className="hidden sm:block w-[60px] md:w-[200px] md:ml-[-2rem]"
          alt="City Food Explorer Logo"
        />

          {/* Mobile Text Logo */}
          <div className="block sm:ml-0 ml-[2rem] md:hidden">
            <h2 className="font-bold text-white text-sm font-nosifer">CITY FOOD</h2>
            <h2 className="font-bold text-white text-sm font-nosifer">EXPLORER</h2>
          </div>

          {/* Desktop Text Logo */}
          <div className="hidden md:block md:ml-[-5rem]">
            <h2 className="font-extrabold text-white text-xl leading-tight font-nosifer">ITY FOOD</h2>
            <h2 className="font-extrabold text-white text-xl leading-tight font-nosifer">EXPLORER</h2>
          </div>

        </Link>
      </div>


      {/* Desktop Navigation */}
      <div className="hidden md:flex ml-6 w-[55%] h-[64px] items-center justify-evenly bg-[#F9D3B2] rounded-lg">
        <ul className="flex space-x-4 lg:space-x-20 w-full justify-center">
          <NavLink to="/" text="Home" />
          <NavLink to="/searchDishesCityWise" text="City" />
          <NavLink to="/searchDishesCategoryWise" text="Food" />
          <NavLink to="/blogs" text="Blogs" />
          <NavLink to="/contact-us" text="Contact" />
        </ul>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-4 right-4 mx-auto bg-[#ebccb1] rounded-xl shadow-xl border border-gray-300 z-[70] py-4 px-6 animate-slideDown transition-all duration-300 ease-in-out">
          <ul className="flex flex-col gap-4">
            <MobileNavLink
              to="/"
              text="Home"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-[#df8638] rounded-md px-3 py-2 text-lg font-semibold text-gray-800 transition duration-200"
            />
            <MobileNavLink
              to="/searchDishesCityWise"
              text="City"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-[#df8638] rounded-md px-3 py-2 text-lg font-semibold text-gray-800 transition duration-200"
            />
            <MobileNavLink
              to="/searchDishesCategoryWise"
              text="Food"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-[#df8638] rounded-md px-3 py-2 text-lg font-semibold text-gray-800 transition duration-200"
            />
            <MobileNavLink
              to="/blogs"
              text="Blogs"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-[#df8638] rounded-md px-3 py-2 text-lg font-semibold text-gray-800 transition duration-200"
            />
            <MobileNavLink
              to="/contact-us"
              text="Contact"
              onClick={() => setIsMenuOpen(false)}
              className="hover:bg-[#df8638] rounded-md px-3 py-2 text-lg font-semibold text-gray-800 transition duration-200"
            />
          </ul>
        </div>
      )}


      {/* User Section */}
      <div className='flex flex-wrap gap-x-2 gap-y-2 sm:gap-x-4 items-center ml-auto md:ml-0'>
        {user ? (
          <UserProfileSection user={user} />
        ) : (
          <AuthButtons matchRoute={matchRoute} />
        )}
      </div>
    </nav>
  );
};

// Reusable Components
const NavLink = ({ to, text }) => (
  <Link to={to}>
    <li className="font-semibold text-sm lg:text-xl hover:cursor-pointer hover:text-white transition-colors">
      {text}
    </li>
  </Link>
);

const MobileNavLink = ({ to, text, onClick }) => (
  <Link to={to} onClick={onClick}>
    <li className="font-semibold text-xl text-center py-2 hover:bg-[#ffe7cf] rounded-md transition-colors">
      {text}
    </li>
  </Link>
);

const UserProfileSection = ({ user }) => (
  <div className="relative flex items-center md:items-end justify-end md:ml-[4rem] gap-2 sm:gap-3 group">
    <span className="hover:cursor-pointer flex items-center p-1 sm:p-2 rounded-lg">
      <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-[#a28c79]">
        <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
      </div>
      {/* Modified username section */}
      <span className="ml-2 sm:ml-4 text-sm sm:text-lg font-extrabold text-white truncate max-w-[120px] sm:max-w-none">
        {user.name}
        {user.role === 'admin' && (
          <span className="hidden sm:inline-block text-xs bg-red-600 text-white px-2 py-1 rounded-full mt-1 sm:mt-0 sm:ml-2">
            🛡️ Admin
          </span>
        )}
      </span>
    </span>

    <div className="absolute top-[110%] right-0 hidden group-hover:flex flex-col bg-[#f9d3b2] shadow-2xl rounded-xl p-4 min-w-[200px] z-30">
      <ProfileLink icon={<FaTachometerAlt />} text="Dashboard" />
      <ProfileLink icon={<FaUserCog />} text="Settings" />
      <LogoutButton />
    </div>
  </div>
);

const ProfileLink = ({ icon, text }) => (
  <a href="/profile" className="flex items-center gap-3 text-gray-700 font-semibold px-4 py-2 hover:bg-[#ffe7cf] rounded-md">
    {icon}
    {text}
  </a>
);

const LogoutButton = () => (
  <button
    onClick={() => {
      cookies.remove('user');
      window.location.href = '/login';
    }}
    className="flex items-center gap-3 text-red-500 font-semibold px-4 py-2 hover:bg-[#ffe7cf] rounded-md text-left"
  >
    <FaSignOutAlt />
    Logout
  </button>
);

const AuthButtons = ({ matchRoute }) => (
  <div className="flex gap-2 lg:ml-[3rem]  flex-wrap sm:flex-nowrap flex-row justify-end sm:justify-center items-center">
    <Link to="/login">
      <button className={`px-4 py-2 lg:h-[3.3rem] lg:px-6 sm:px-[20px] sm:py-[10px] text-sm font-bold transition-all duration-200 hover:bg-[#f0c9a6] rounded-xl hover:scale-95 ${
        matchRoute('/login') 
          ? 'border-[2px] bg-[#f0c9a6] border-caribbeangreen-900' 
          : 'border border-richblack-700 bg-[#9d816a]'
      }`}>
        Login
      </button>
    </Link>

    <Link to="/signup">
      <button className={`px-4 py-2 lg:h-[3.3rem] lg:px-6 sm:px-[20px] sm:py-[10px] text-sm font-bold transition-all duration-200 hover:bg-[#f0c9a6] rounded-xl hover:scale-95 ${
        matchRoute('/signup') 
          ? 'border-[2px] bg-[#f0c9a6] border-caribbeangreen-900' 
          : 'border border-richblack-700 bg-[#9d816a]'
      }`}>
        Signup
      </button>
    </Link>
  </div>
);


export default Navbar;
