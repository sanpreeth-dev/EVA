import React, { useState, useEffect } from "react";
import ProfileModal from "../components/Modals/ProfileModal";
import { Outlet, Link, NavLink, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import { motion, LayoutGroup } from "framer-motion";
import { getCommandPath } from "../utils/navigate";

import { MagnifyingGlassIcon, UserCircleIcon, Bars3Icon, XMarkIcon } from "../components/icons/Icons";

// --- Main RootLayout Component ---


function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCommandNavigation = (e) => {
    if (e.key === 'Enter') {
      const path = getCommandPath(searchQuery);
      if (path) {
        navigate(path);
      } else {
        console.log("Unknown command:", searchQuery);
      }
      setSearchQuery(""); // Clear input after command
    }
  };

  /* 
    Initialize user state from localStorage. 
    The 'user' key is set in user.js upon login/signup.
  */
  const [user, setUser] = useState({
    name: "Guest",
    email: "Please log in",
    imageUrl: "https://placehold.co/200x200/C4B5FD/3730A3?text=G",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser({
        ...parsedUser,
        // Ensure we have an image even if backend doesn't provide one
        imageUrl: parsedUser.imageUrl || `https://placehold.co/200x200/C4B5FD/3730A3?text=${(parsedUser.username?.[0] || "U").toUpperCase()}`
      });
    } else {
      setUser({
        name: "Guest",
        email: "Please log in",
        imageUrl: "https://placehold.co/200x200/C4B5FD/3730A3?text=G",
      });
    }
  }, [location.pathname]); // Re-run whenever the route changes (e.g. after login/logout)

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/userGuide", text: "UserGuide" },
    { to: "/account", text: "Account" },
    { to: "/about", text: "About" },
  ];

  const toggleProfileModal = () => setIsProfileModalOpen((prev) => !prev);

  return (
    <div className={`relative min-h-screen font-sans ${location.pathname === "/avatar" ? "bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" : "bg-transparent"}`}>
      <ScrollRestoration />

      {location.pathname !== "/avatar" && (
        <ShaderGradientCanvas
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <ShaderGradient
            animate="on"
            axesHelper="on"
            bgColor1="#000000"
            bgColor2="#000000"
            brightness={1.2}
            cAzimuthAngle={180}
            cDistance={2.41}
            cPolarAngle={95}
            cameraZoom={1}
            color1="#ff4aea"
            color2="#c71e81"
            color3="#e25bfd"
            destination="onCanvas"
            embedMode="off"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="off"
            lightType="3d"
            pixelDensity={1}
            positionX={0}
            positionY={-2.1}
            positionZ={0}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={0}
            rotationY={0}
            rotationZ={225}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0}
            uDensity={1.8}
            uFrequency={5.5}
            uSpeed={0.2}
            uStrength={3}
            uTime={0.2}
            wireframe={false}
          />
        </ShaderGradientCanvas>
      )}

      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                to="/avatar"
                reloadDocument
                className="flex-shrink-0 text-gray-800 flex items-center gap-2"
              >
                <img
                  src="/favicon.ico"
                  alt="EVA Logo"
                  className="h-8 w-8"
                />
                <span className="font-bold text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-[length:200%_200%] animate-gradientMove bg-clip-text text-transparent">EVA</span>
              </Link>
              <div className="hidden md:block">
                <LayoutGroup>
                  <div className="ml-10 flex items-baseline space-x-2">
                    {navLinks.map((link) => (
                      <NavLink key={link.to} to={link.to}>
                        {({ isActive }) => (
                          // FIX: Removed the `layout` prop from this div
                          <div className="relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <span className={isActive ? "text-purple-600 font-semibold" : "text-gray-500 hover:text-gray-900"}>
                              {link.text}
                            </span>
                            {isActive && (
                              <motion.div
                                className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-purple-500"
                                layoutId="underline"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}
                          </div>
                        )}
                      </NavLink>
                    ))}
                  </div>
                </LayoutGroup>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleCommandNavigation}
                  className="bg-gray-200/50 text-gray-800 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 w-64"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {user.name !== "Guest" ? (
                <button
                  onClick={toggleProfileModal}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-200/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <UserCircleIcon className="h-6 w-6" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login">
                    <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-200/60 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/50">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              {navLinks.map((link) => (
                <NavLink key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)}>
                  {({ isActive }) => (
                    <div className="relative block px-3 py-2 rounded-md text-base font-medium">
                      <span className={isActive ? "text-purple-600 font-semibold" : "text-gray-500 hover:text-gray-900"}>
                        {link.text}
                      </span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
            <div className="border-t border-gray-200 pb-3 pt-4 px-5">
              {user.name !== "Guest" ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      toggleProfileModal();
                      setIsMobileMenuOpen(false);
                    }}
                    className="p-1 rounded-full text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <UserCircleIcon className="h-8 w-8" />
                  </button>
                  <div>
                    <div className="text-base font-medium leading-none text-gray-800">
                      {user.username || user.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-500 mt-1">
                      {user.email}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 text-sm font-medium text-purple-600 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm">
                      Sign up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {isProfileModalOpen && (
        <ProfileModal
          user={user}
          onClose={() => setIsProfileModalOpen(false)}
        />
      )}

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default RootLayout;