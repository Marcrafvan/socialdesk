"use client";

import { useState } from "react";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Video, // for TikTok
  Image as ImageIcon, 
  Wand2, // for AI icon
  Calendar,
  Clock
} from "lucide-react";

export default function SchedulePage() {
  // Simple state to handle platform selection visually
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Content Scheduler</h1>
        <p className="text-muted">Create and schedule posts with AI assistance</p>
      </div>

      {/* Main Grid Layout - Matches Wireframe */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Content Creation (Takes up 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Content Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full min-h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-700">Content</h2>
              <button className="flex items-center gap-2 text-xs font-medium text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors">
                <Wand2 size={14} />
                Ask AI Assistant
              </button>
            </div>

            {/* Text Area */}
            <textarea 
              className="w-full flex-1 p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="What's on your mind? Write your caption here..."
            ></textarea>

            {/* Media Upload Bar */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                <ImageIcon size={18} />
                Add Photo
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                <Video size={18} />
                Add Video
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings (Takes up 1 column) */}
        <div className="space-y-6">

          {/* 1. Platform Selector Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">Select Platform</h2>
            <div className="grid grid-cols-2 gap-3">
              <PlatformButton 
                name="Facebook" 
                icon={<Facebook size={18} />} 
                isSelected={selectedPlatforms.includes('facebook')}
                onClick={() => togglePlatform('facebook')}
                color="text-blue-600"
              />
              <PlatformButton 
                name="Instagram" 
                icon={<Instagram size={18} />} 
                isSelected={selectedPlatforms.includes('instagram')}
                onClick={() => togglePlatform('instagram')}
                color="text-pink-600"
              />
              <PlatformButton 
                name="Twitter" 
                icon={<Twitter size={18} />} 
                isSelected={selectedPlatforms.includes('twitter')}
                onClick={() => togglePlatform('twitter')}
                color="text-sky-500"
              />
              <PlatformButton 
                name="TikTok" 
                icon={<Video size={18} />} 
                isSelected={selectedPlatforms.includes('tiktok')}
                onClick={() => togglePlatform('tiktok')}
                color="text-black"
              />
            </div>
          </div>

          {/* 2. Schedule Settings Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-700 mb-4">Schedule Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                  <input 
                    type="time" 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <hr className="border-gray-100 my-4" />

              <button className="w-full bg-primary text-white font-medium py-3 rounded-lg hover:bg-blue-900 transition-colors shadow-lg shadow-blue-900/20">
                Schedule Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Component for the Platform Buttons
function PlatformButton({ name, icon, isSelected, onClick, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
        isSelected 
          ? 'border-primary bg-blue-50/50 ring-1 ring-primary' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className={`mb-2 ${color}`}>{icon}</div>
      <span className="text-xs font-medium text-gray-600">{name}</span>
    </button>
  );
}