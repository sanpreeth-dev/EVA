import React, { useState, useEffect } from "react";
import { useUserContext, useLogout, useUpdateUserContext } from "../utils/user";
import { useNavigate } from "react-router-dom";
import { User, LogOut, Clock, Activity, Pencil, Check, X } from "lucide-react";
import { useChat } from "../hooks/useChat";

export default function Account() {
  const { data: userContext, isLoading, isError, error } = useUserContext();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const { mutate: updateContext, isPending: isUpdating } = useUpdateUserContext();
  const { avatar: currentAvatar, setAvatar, avatars } = useChat();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState("");

  // Sync local state with fetched data
  useEffect(() => {
    if (userContext?.bio) {
      setBioInput(userContext.bio);
    }
  }, [userContext]);

  const handleLogout = () => {
    logout(null, {
      onSettled: () => {
        navigate("/");
      },
    });
  };

  const handleSaveBio = () => {
    updateContext({ bio: bioInput }, {
      onSuccess: () => {
        setIsEditing(false);
      }
    });
  };

  const handleCancelEdit = () => {
    setBioInput(userContext?.bio || "");
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-purple-50 text-gray-800 p-4">
        <p className="text-red-500 mb-4">Error loading profile: {error?.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans p-6 bg-transparent text-gray-800 flex justify-center items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-transparent"></div>
      {/* Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left side */}
        <div
          className="absolute top-10 left-0 w-20 h-20 bg-purple-200 rounded-full opacity-40 animate-bounce"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="absolute bottom-20 left-0 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Right side */}
        <div
          className="absolute top-32 right-0 w-24 h-24 bg-blue-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-10 right-0 w-40 h-40 bg-yellow-200 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>

        {/* Optional extra side bubbles */}
        <div
          className="absolute top-1/2 left-0 w-14 h-14 bg-pink-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-1/3 right-0 w-20 h-20 bg-purple-300 rounded-full opacity-30 animate-bounce"
          style={{ animationDelay: "0.8s" }}
        ></div>
      </div>

      <div className="w-full max-w-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40 z-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/60 rounded-full shadow-sm">
              <User className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Profile
            </h1>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-100/50 hover:bg-red-100 text-red-600 rounded-xl transition-all border border-red-200 shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">

          {/* Bio Section */}
          <div className="bg-white/60 rounded-2xl p-6 border border-white/50 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" />
                EVA Context Log
              </h2>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 hover:bg-purple-100 rounded-lg transition-colors text-purple-500"
                  title="Edit context"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCancelEdit}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-500"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveBio}
                    disabled={isUpdating}
                    className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {isEditing ? (
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="w-full h-32 p-3 bg-white/50 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none text-gray-700 text-lg leading-relaxed"
                placeholder="What should EVA know about you?"
                autoFocus
              />
            ) : (
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {userContext?.bio || "No context available yet."}
              </p>
            )}
          </div>

          {/* Avatar Selection Section */}
          <div className="bg-white/60 rounded-2xl p-6 border border-white/50 shadow-sm transition-all hover:shadow-md mt-6">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-6">
              <User className="w-4 h-4 text-purple-500" />
              Select Your Avatar
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {avatars.map((item) => (
                <div
                  key={item.name}
                  className="relative group rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-purple-400 transition-all cursor-pointer"
                  onClick={() => setAvatar(item)}
                >
                  {/* Avatar Image */}
                  <img
                    src={item.thumbnail}
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Selected Overlay */}
                  {currentAvatar.name === item.name && (
                    <div className="absolute inset-0 bg-purple-600/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                      <div className="bg-white border-white p-2 px-4 rounded-full shadow-lg">
                        <span className="text-purple-600 font-bold text-sm tracking-widest uppercase">Selected</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Select Button */}
                  {currentAvatar.name !== item.name && (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white text-purple-600 font-bold py-2 px-6 rounded-xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        Select
                      </button>
                    </div>
                  )}

                  {/* Name Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white font-semibold text-center">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userContext?.lastUpdated && (
              <div className="bg-white/60 rounded-xl p-4 border border-white/50 shadow-sm flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Last Updated</p>
                  <p className="font-medium text-gray-800">
                    {new Date(userContext.lastUpdated).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            {/* You can add more fields here if the backend returns them */}
          </div>

        </div>
      </div>
    </div>
  );
}
