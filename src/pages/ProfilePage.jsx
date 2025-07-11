import React, { useState, useEffect } from "react";
import { FaTachometerAlt, FaHeart, FaBookmark, FaSignOutAlt, FaEdit } from "react-icons/fa";
import { VscGitPullRequestNewChanges } from "react-icons/vsc";
import { BiSolidCategoryAlt } from "react-icons/bi";
import Swal from 'sweetalert2';
import Cookies from "universal-cookie";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import datalist from "../data/stateDistrict.js";
import backgroundImage from "../assets/loginbackground.jpg";
import axios from 'axios';
import CustomToast from "../components/common/CustomToast";

const cookies = new Cookies();
const backendUrl = process.env.REACT_APP_BASE_URL;
const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;

const ProfilePage = () => {
  const navigate = useNavigate();
  const user = cookies.get('user');
  const token = cookies.get('token');

  useEffect(() => {
    if (!token || !user) {
      window.location.href = '/login';
      return;
    }
  }, []);

  const [selectedTab, setSelectedTab] = useState('Dashboard');
  const [likedDishes, setLikedDishes] = useState([]);
  const [savedDishes, setSavedDishes] = useState([]);
  const [addedDish, setAddedDish] = useState([]);
  const [addedByUser, setAddedByUser] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    gender: user.gender || "",
    state: user.state || "",
    city: user.city || "",
    mobile: user.mobile || "",
    address: user.address || "",
    occupation: user.occupation || "",
    aboutMe: user.aboutMe || ""
  });
  const [cities, setCities] = useState([]);

  useEffect(() => {
    if (formData.state) {
      const selectedState = datalist.states.find(item => item.state === formData.state);
      setCities(selectedState ? selectedState.districts : []);
    } else {
      setCities([]);
    }
  }, [formData.state]);

  useEffect(() => {
    const getDishes = async () => {
      const res = await fetch(`${backendUrl}/api/likedSavedDishes/${user._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLikedDishes(data.likedDishes || []);
        setSavedDishes(data.savedDishes || []);
      }
    };
    getDishes();
  }, []);

  useEffect(() => {
    fetch(`${backendUrl}/api/dishAddedByUser/${user._id}`)
      .then(res => res.json())
      .then(data => setAddedDish(data))
      .catch(err => console.error("Network Error:", err));
  }, [user._id]);

  useEffect(() => {
    if (user.email === adminEmail) {
      fetch(`${backendUrl}/api/addedDish/adminPage`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setAddedByUser(data))
        .catch(err => console.error("Network Error:", err));
    }
  }, [user.email]);

  const handleLogout = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Logout',
      text: 'Are you sure?',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      background: '#1f1f1f'
    }).then((result) => {
      if (result.isConfirmed) {
        toast.success("Logged Out Successfully", {
          onClose: () => {
            cookies.remove('token');
            cookies.remove('user');
            window.location.href = '/';
          },
          autoClose: 1000,
          position: 'bottom-right',
          theme: 'colored'
        });
      }
    });
  };

  const handleRemoveFromSave = async (dishId, userId) => {
    try {
      const res = await fetch(`${backendUrl}/api/RemoveSavedDish/${dishId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId })
      });
      if (res.ok) {
        setSavedDishes(prev => prev.filter(dish => dish._id !== dishId));
        toast.success("Dish removed successfully", { autoClose: 1000, theme: 'colored' });
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to remove dish");
      }
    } catch (error) {
      toast.error("An error occurred while removing the dish");
    }
  };

  const handleAccept = (dishId) => {
    fetch(`${backendUrl}/api/addedDish/${dishId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies.get('token')}`
      },
      body: JSON.stringify()
    })
    .then((res) => {
      if(res.ok){
        setAddedByUser(prev => prev.filter(dish => dish._id !== dishId));
        toast.success("Dish added successfully", {
          autoClose: 1500, position: 'bottom-right', theme: 'colored'
        });
      } else {
        toast.error("Something went wrong", {
          autoClose: 1500, position: 'bottom-right', theme: 'colored'
        });
      }
    })
    .catch((err) => {
      console.error("Server Issue:", err.message);
      toast.error("Network Error", { autoClose: 1500, position: 'bottom-right', theme: 'colored' });
    });
  };

  const handleReject = (dishId) => {
    fetch(`${backendUrl}/api/addedDish/rejected/${dishId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify()
    })
    .then((res) => {
      if(res.ok){
        setAddedByUser(prev => prev.filter(dish => dish._id !== dishId));
        toast.success("Dish removed successfully", {
          autoClose: 1500, position: 'bottom-right', theme: 'colored'
        });
      } else {
        toast.error("Something went wrong", {
          autoClose: 1500, position: 'bottom-right', theme: 'colored'
        });
      }
    })
    .catch((err) => {
      console.error("Server Issue:", err);
      toast.error("Network Error", { autoClose: 1500, position: 'bottom-right', theme: 'colored' });
    });
  };

  const handleClickOnDish = (dishName) => {
    cookies.set('searchedDish', dishName);
    window.location.href = '/searchedDish';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    cookies.set('user', updatedUser, { path: '/' });
    setIsEditing(false);
    toast.success("Profile Updated Successfully!", {
      autoClose: 1500,
      position: 'bottom-right',
      theme: 'colored'
    });
  };

  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#f9d3b2]/20 backdrop-blur-md flex justify-around md:hidden py-3 border-t border-white/10">
      <button onClick={() => setSelectedTab('Dashboard')} className={`flex flex-col items-center text-sm ${selectedTab === 'Dashboard' ? 'text-yellow-400' : 'text-white'}`}>
        <FaTachometerAlt className="text-xl mb-1" /> Dashboard
      </button>
      <button onClick={() => setSelectedTab('Liked')} className={`flex flex-col items-center text-sm ${selectedTab === 'Liked' ? 'text-yellow-400' : 'text-white'}`}>
        <FaHeart className="text-xl mb-1" /> Liked
      </button>
      <button onClick={() => setSelectedTab('Saved')} className={`flex flex-col items-center text-sm ${selectedTab === 'Saved' ? 'text-yellow-400' : 'text-white'}`}>
        <FaBookmark className="text-xl mb-1" /> Saved
      </button>
      <button onClick={() => setSelectedTab('Requests')} className={`flex flex-col items-center text-sm ${selectedTab === 'Requests' ? 'text-yellow-400' : 'text-white'}`}>
        <VscGitPullRequestNewChanges className="text-xl mb-1" /> Requests
      </button>
      <button onClick={handleLogout} className="flex flex-col items-center text-sm text-red-400">
        <FaSignOutAlt className="text-xl mb-1" /> Logout
      </button>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row absolute min-h-screen bg-cover w-full left-0 top-0" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      {/* Desktop Sidebar Only */}
      <div className="hidden md:flex relative top-[6rem] max-h-[37rem] z-10 bg-[#f9d3b2]/15 shadow-xl p-6 flex-col gap-4 w-56">
        <button onClick={() => setSelectedTab('Dashboard')} className="flex items-center gap-4 text-xl font-semibold text-[#ffca9c] p-2 rounded-lg hover:bg-[#ffca9c]/20 hover:text-white transition duration-300">
          <FaTachometerAlt /> Dashboard
        </button>
        <button onClick={() => setSelectedTab('Liked')} className="flex items-center gap-4 text-xl font-semibold text-[#ffca9c] p-2 rounded-lg hover:bg-[#ffca9c]/20 hover:text-white transition duration-300">
          <FaHeart /> Liked Dishes
        </button>
        <button onClick={() => setSelectedTab('Saved')} className="flex items-center gap-4 text-xl font-semibold text-[#ffca9c] p-2 rounded-lg hover:bg-[#ffca9c]/20 hover:text-white transition duration-300">
          <FaBookmark /> Saved Dishes
        </button>
        <button onClick={() => setSelectedTab('Requests')} className="flex items-center gap-4 text-xl font-semibold text-[#ffca9c] p-2 rounded-lg hover:bg-[#ffca9c]/20 hover:text-white transition duration-300">
          <VscGitPullRequestNewChanges /> Requests
        </button>
        {user.email === adminEmail && (
          <button onClick={() => navigate('/addCategory')} className="flex items-center gap-4 text-xl font-semibold text-[#ffca9c] p-2 rounded-lg hover:bg-[#ffca9c]/20 hover:text-white transition duration-300">
            <BiSolidCategoryAlt /> Category
          </button>
        )}
        <button onClick={handleLogout} className="flex items-center gap-4 text-xl font-semibold text-red-600 p-2 rounded-lg hover:bg-[#ffca9c]/20 hover:text-[#feb240] transition duration-300">
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Main Profile Content */}
      <div className="relative mt-[3rem] md:mt-[6rem] rounded-xl w-full md:flex-1 flex flex-col items-start bg-black/20 overflow-y-auto md:ml-[4rem] ml-0">
        {selectedTab === 'Dashboard' && (
          <>
            {/* Profile Details and Edit Section */}
            <div className="w-full max-w-2xl p-8 rounded-2xl bg-white/10 shadow-2xl border border-white/20 backdrop-blur-sm transition duration-300 mx-auto mt-8">
              <h2 className="text-4xl md:text-6xl font-medium text-[#f1d8c5] text-center">
                Welcome, {user.name}
              </h2>

              <div className="flex flex-col items-center gap-6 mt-6">
                {/* Profile Image */}
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#a28c79] shadow-lg">
                  <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>

                {/* Name + Edit Button */}
                <div className="flex flex-col items-center">
                  <h2 className="text-2xl font-semibold text-[#feb240]">
                    {formData.name || user.name}
                  </h2>
                  <button onClick={() => setIsEditing(!isEditing)}
                          className="mt-2 flex items-center gap-2 bg-[#feb240]/20 hover:bg-[#feb240]/70 text-white font-medium px-4 py-2 rounded-full shadow">
                    <FaEdit /> {isEditing ? "Cancel" : "Edit Profile"}
                  </button>
                </div>

                {/* Divider */}
                <div className="w-full border-t border-white/20 my-4"></div>

                {/* Profile Info Grid */}
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-sm">
                  <div>
                    <p className="font-semibold text-[#f1d8c5]">Gender</p>
                    <p>{formData.gender || user.gender || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#f1d8c5]">Occupation</p>
                    <p>{formData.occupation || user.occupation || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#f1d8c5]">State</p>
                    <p>{formData.state || user.state || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#f1d8c5]">City</p>
                    <p>{formData.city || user.city || "—"}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#f1d8c5]">Mobile</p>
                    <p>{formData.mobile || user.mobile || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-[#f1d8c5]">Address</p>
                    <p>{formData.address || user.address || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-[#f1d8c5]">About Me</p>
                    <p className="italic text-gray-300">{formData.aboutMe || user.aboutMe || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Profile Edit Form */}
              {isEditing && (
                <div className="w-full max-w-2xl mt-8 flex flex-col gap-4 mx-auto">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select name="gender" value={formData.gender} onChange={handleChange}
                            className="w-full sm:w-1/2 p-3 rounded-lg bg-black/30 text-white">
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange}
                           placeholder="Occupation" className="w-full sm:w-1/2 p-3 rounded-lg bg-black/30 text-white" />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <select name="state" value={formData.state} onChange={handleChange}
                            className="w-full sm:w-1/2 p-3 rounded-lg bg-black/30 text-white">
                      <option value="">Select State</option>
                      {datalist.states.map((stateItem, idx) => (
                        <option key={idx} value={stateItem.state}>{stateItem.state}</option>
                      ))}
                    </select>
                    <select name="city" value={formData.city} onChange={handleChange}
                            className="w-full sm:w-1/2 p-3 rounded-lg bg-black/30 text-white">
                      <option value="">Select City</option>
                      {cities.map((cityItem, idx) => (
                        <option key={idx} value={cityItem}>{cityItem}</option>
                      ))}
                    </select>
                  </div>

                  <input type="text" name="mobile" value={formData.mobile} onChange={handleChange}
                         placeholder="Mobile Number" className="w-full p-3 rounded-lg bg-black/30 text-white" />
                  <input type="text" name="address" value={formData.address} onChange={handleChange}
                         placeholder="Address" className="w-full p-3 rounded-lg bg-black/30 text-white" />
                  <textarea name="aboutMe" value={formData.aboutMe} onChange={handleChange}
                            placeholder="About Me" rows="4"
                            className="w-full p-3 rounded-lg bg-black/30 text-white resize-none"></textarea>

                  <button onClick={handleSave}
                          className="mt-4 w-full bg-[#feb240]/80 hover:bg-[#feb240] text-white font-semibold px-6 py-3 rounded-lg shadow-lg">
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Liked Dishes Tab */}
        {selectedTab === 'Liked' && (
          <div className="w-full bg-white/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 mt-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#e0a854] mb-4 text-center">
              <span className="text-white">{user.name}</span>, Your Liked Dishes
            </h2>
            {likedDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {likedDishes.map((dish) => (
                  <div key={dish._id} onClick={() => navigate(`/searchedDish/${dish.dishName}`)}
                       className="cursor-pointer bg-white/10 hover:bg-white/20 p-4 rounded-lg shadow-lg">
                    <img src={dish.img} alt={dish.dishName}
                         className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h3 className="text-xl font-bold text-[#feb240]">{dish.dishName}</h3>
                    <p className="text-sm text-gray-300">{dish.shopName}, {dish.shopLocation}</p>
                    <p className="text-sm text-[#ffd69f] mt-1">₹{dish.dishPrice}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">No liked dishes found.</p>
            )}
          </div>
        )}

        {/* Saved Dishes Tab */}
        {selectedTab === 'Saved' && (
          <div className="w-full bg-white/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 mt-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-[#e0a854] mb-4 text-center">
              <span className="text-white">{user.name}</span>, Your Saved Dishes
            </h2>
            {savedDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {savedDishes.map((dish) => (
                  <div key={dish._id}
                       className="w-full sm:w-80 bg-white/10 hover:bg-white/20 p-5 rounded-lg shadow-lg">
                    <img src={dish.img} alt={dish.dishName}
                         className="w-full h-40 object-cover rounded-lg mb-3 cursor-pointer"
                         onClick={() => navigate(`/searchedDish/${dish.dishName}`)} />
                    <div className="flex justify-between items-center">
                      <div onClick={() => navigate(`/searchedDish/${dish.dishName}`)}
                           className="cursor-pointer">
                        <h3 className="text-xl font-bold text-[#feb240]">{dish.dishName}</h3>
                        <p className="text-sm text-gray-300">{dish.shopName}, {dish.shopLocation}</p>
                        <p className="text-sm text-[#ffd69f] mt-1">₹{dish.dishPrice}</p>
                      </div>
                      <button onClick={() => handleRemoveFromSave(dish._id, user._id)}
                              className="bg-[#d5b789] p-2 rounded-md hover:bg-[#feb240] hover:text-white hover:font-semibold">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white">No saved dishes found.</p>
            )}
          </div>
        )}

        {/* Requests Tab */}
        {selectedTab === 'Requests' && (
          <>
            {user.email === adminEmail ? (
              <div className="w-full bg-white/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 mt-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-[#e0a854] mb-4 text-center">
                  <span className="text-white">{user.name}</span>, Users Pending Contribution
                </h2>
                {addedByUser.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full justify-items-center">
                    {addedByUser.map((dish) => (
                      <div key={dish._id}
                           className="w-full sm:w-[90%] bg-white/10 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="w-full sm:w-48 h-40 overflow-hidden rounded-lg">
                          <img src={dish.img} alt={dish.dishName}
                               className="w-full h-full object-cover" />
                        </div>
                        {/* Details */}
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                              <h3 className="text-2xl font-bold text-[#ffd5a4]">{dish.dishName}</h3>
                              <span className="text-sm text-gray-300 italic">{dish.cityName}, {dish.cityState}</span>
                            </div>
                            <p className="text-gray-300"><span className="font-semibold">Shop:</span> {dish.shopName}, {dish.shopLocation}</p>
                            <p className="text-gray-300"><span className="font-semibold">Category:</span> {dish.category} | <span className="font-semibold">Price:</span> ₹{dish.dishPrice}</p>
                            <p className="text-gray-400 text-sm mt-1">{dish.description}</p>
                          </div>
                          <div className="flex gap-4 mt-4">
                            <button onClick={() => handleAccept(dish._id)}
                                    className="bg-green-500 hover:bg-green-600 hover:text-black hover:shadow-lg transition duration-300 px-4 py-2 text-white font-semibold rounded-md shadow">
                              ✅ Approve
                            </button>
                            <button onClick={() => handleReject(dish._id)}
                                    className="bg-red-500 hover:bg-red-600 hover:text-black hover:shadow-lg transition duration-300 px-4 py-2 text-white font-semibold rounded-md shadow">
                              ❌ Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white text-xl">No requests pending.</p>
                )}
              </div>
            ) : (
              <div className="w-full bg-white/20 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 mt-8">
                <h2 className="text-3xl md:text-4xl font-semibold text-[#e0a854] mb-4 text-center">
                  <span className="text-white">{user.name}</span>, Your Requests
                </h2>
                {addedDish.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full justify-items-center">
                    {addedDish.map((dish) => (
                      <div key={dish._id}
                           className="w-full sm:w-[90%] bg-white/10 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row gap-4">
                        {/* Image */}
                        <div className="w-full sm:w-48 h-40 overflow-hidden rounded-lg">
                          <img src={dish.img} alt={dish.dishName}
                               className="w-full h-full object-cover" />
                        </div>
                        {/* Details */}
                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                              <h3 className="text-2xl font-bold text-[#ffd5a4]">{dish.dishName}</h3>
                              <span className="text-sm text-gray-300 italic">{dish.cityName}, {dish.cityState}</span>
                            </div>
                            <p className="text-gray-300"><span className="font-semibold">Shop:</span> {dish.shopName}, {dish.shopLocation}</p>
                            <p className="text-gray-300"><span className="font-semibold">Category:</span> {dish.category} | <span className="font-semibold">Price:</span> ₹{dish.dishPrice}</p>
                            <p className="text-gray-400 text-sm mt-1">{dish.description}</p>
                          </div>
                          <div className="mt-4">
                            <span className={`px-4 py-1 text-sm font-semibold rounded-full ${dish.status === "Added✅" ? "bg-green-600 text-white" : "bg-yellow-500 text-black"}`}>
                              {dish.status || "⏳ Request Pending"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-white text-xl">No requests found.</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <MobileNav />

      <CustomToast />
    </div>
  );
};

export default ProfilePage;
