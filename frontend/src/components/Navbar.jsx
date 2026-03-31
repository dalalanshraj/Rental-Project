import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Phone } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios.js"
import logoIme from "../assets/logo/logo-img.png"; // Default logo
import logoScrolled from "../assets/logo/logo-img1.png"; // <-- Add your second logo here

const Navbar = ({listing}) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
 const [communities, setCommunities] = useState([]);
 if (location.pathname.startsWith("/admin")) {
    return null;
  }
useEffect(() => {
  const fetchCommunities = async () => {
    try {
      const res = await api.get("/listings/published");
      setCommunities(res.data);
      // console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCommunities();
}, []);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dropdowns = {
    ABOUT: [
      { name: "ABOUT", link: "about-us" },
      // { name: "FAQ", link: "/faq" },
      // { name: "CONTACT", link: "/contact" },
    ],
COMMUNITIES: Array.isArray(communities)
  ? communities.map((item) => ({
      name: item.property?.title,   // ✅ FIXED
      link: `/community/${item._id}`,
    }))
  : [],
   
  };

  const menuItems = [
    { name: "HOME", link: "/" },
     { name: "ABOUT" },
    { name: "COMMUNITIES" },
    { name: "LISTINGS" , link: "/properties" },
    { name: "SPECIALS", link: "/specials" },
    // { name: "ACTIVITIES", link: "/activities" },
    { name: "REVIEWS", link: "/reviews" },
    // { name: "CALENDARS", link: "/calendars" },
   
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* --- Top Row (Logo + Phone) --- */}
      <div
        className={`flex justify-between items-center px-10 py-3 transition-colors duration-300 ${
          isScrolled ? "text-gray-800" : "text-white"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={isScrolled ? logoScrolled : logoIme}
            alt="Coastal Dream Rentals"
            className="w-84 object-contain transition-all duration-300"
          />
        </Link>

        {/* Contact */}
        <div className="flex items-center space-x-3 transition-all duration-300">
          <div className="text-right leading-tight">
            <p className="text-1xl font-bold">Call today</p>
            <p
              className={`font-bold text-2xl transition-colors duration-300 ${
                isScrolled ? "text-[#185089]" : "text-white"
              }`}
            >
              {isScrolled ? "850-974-4757" : "850-974-4757"}
            </p>
          </div>
          <Phone
            size={24}
            className={`transition-colors duration-300 ${
              isScrolled ? "text-[#185089]" : "text-white"
            }`}
          />
        </div>
      </div>

      {/* --- Bottom Row (Nav Bar) --- */}
      <nav
        className="flex justify-center items-center p-2 space-x-21 font-bold text-[16.5px] fontFamily transition-colors duration-300 bg-[#48d9ff] text-white"
      >
        {menuItems.map((item) => {  
          const hasDropdown = dropdowns[item.name];
          return (
            <div
              key={item.name}
              className="relative py-3 cursor-pointer"
              onMouseEnter={() => hasDropdown && setOpenDropdown(item.name)}
              onMouseLeave={() => hasDropdown && setOpenDropdown(null)}
            >
              {item.link ? (
                <Link to={item.link} className="hover:opacity-80">
                  {item.name}
                </Link>
              ) : (
                <span className="hover:opacity-80">{item.name}</span>
              )}

              {/* Dropdown */}
              {openDropdown === item.name && hasDropdown && (
                <ul className="absolute top-10 left-0 bg-blue-500 text-white rounded shadow-lg mt-1 min-w-[160px] z-50">
                  {dropdowns[item.name].map((sub, index) => (
  <li key={sub._id || index}>
    <Link
      to={sub.link}
      className="block px-4 py-2 hover:bg-blue-600 whitespace-nowrap"
    >
      {sub.name}
    </Link>
  </li>
))}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
