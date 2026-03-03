"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Search, Bell, User, Menu, ChevronDown, LogOut } from "lucide-react";

export default function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(false);
    setUserMenuOpen(false);
    Cookies.remove("auth-token");
    router.push("/login");
  };

  return (
    <>
      <header className="bg-white/50 backdrop-blur-sm border-b border-gray-100 h-20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
        
        {/* 1. Left Side: Hamburger (Mobile) + Search (Desktop) */}
        <div className="flex items-center gap-2 md:gap-4 flex-1">
          
          {/* The Hamburger Button */}
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="relative w-full max-w-xs md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* 2. Right Actions */}
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          
          <button className="relative text-primary hover:bg-blue-50 p-2 rounded-full transition-colors cursor-pointer">
            <Bell size={24} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Menu Dropdown */}
          <div className="relative pl-4 md:pl-6 border-l border-gray-200" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              aria-expanded={userMenuOpen}
              aria-haspopup="true"
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 overflow-hidden shrink-0">
                <User size={24} /> 
              </div>
              <div className="hidden md:flex items-center gap-1.5">
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-none text-left">John Doe</p>
                  <p className="text-xs text-gray-500 mt-1 text-left">johndoe@gmail.com</p>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1.5 overflow-hidden">
                {/* Mobile-only: show name in dropdown */}
                <div className="md:hidden px-4 py-2.5 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-500">johndoe@gmail.com</p>
                </div>
                <button
                  onClick={() => { setUserMenuOpen(false); /* TODO: navigate to profile */ }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <User size={16} className="text-gray-400 shrink-0" /> Profile
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { setUserMenuOpen(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut size={16} className="text-red-400 shrink-0" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 sm:p-8 text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <LogOut size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Sign out?</h2>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}