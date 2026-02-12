"use client";

import { useState } from "react";
import { 
  Facebook, 
  Instagram, 
  Trash2, 
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Video,
  PlayCircle,
  Image as ImageIcon
} from "lucide-react";

// 1. Updated Post Type to support Media
type Post = {
  id: string;
  content: string;
  status: "published" | "scheduled" | "failed";
  platforms: string[];
  date: string;
  mediaType?: "image" | "video" | "none"; // New field
  mediaUrl?: string; // New field (URL to the image/video)
};

export default function PostsPage() {
  // 2. Mock Data with Images and Videos
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "Excited to launch our new product! 🚀 #LaunchDay",
      status: "published",
      platforms: ["facebook", "instagram"],
      date: "Feb 8, 2026, 10:20 AM",
      mediaType: "image",
      // Using a random Unsplash image as a placeholder
      mediaUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
    },
    {
      id: "2",
      content: "Behind the scenes at our annual team retreat. Check out the vibes! 🌴",
      status: "scheduled",
      platforms: ["tiktok"],
      date: "Feb 14, 2026, 5:00 PM",
      mediaType: "video",
      // Placeholder for a video thumbnail
      mediaUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"
    },
    {
      id: "3",
      content: "Just a quick text update about our holiday hours.",
      status: "published",
      platforms: ["x"],
      date: "Feb 10, 2026, 9:00 AM",
      mediaType: "none"
    }
  ]);

  const deletePost = (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">Posts</h1>
        <p className="text-muted">View and manage your content library</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            
            {/* Header: Status & Actions */}
            <div className="flex justify-between items-start mb-4">
              <StatusBadge status={post.status} />
              <button 
                onClick={() => deletePost(post.id)}
                className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Layout: Content + Media Side-by-Side (on larger screens) */}
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* Media Preview Section */}
              {post.mediaType !== 'none' && post.mediaUrl && (
                <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                  {/* Image Render */}
                  <img 
                    src={post.mediaUrl} 
                    alt="Post media" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Overlay (Play Button) */}
                  {post.mediaType === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-all">
                      <PlayCircle className="text-white w-10 h-10 opacity-90" />
                    </div>
                  )}

                  {/* Icon Badge (Corner) */}
                  <div className="absolute top-2 right-2 bg-black/50 p-1 rounded text-white backdrop-blur-sm">
                    {post.mediaType === 'video' ? <Video size={12} /> : <ImageIcon size={12} />}
                  </div>
                </div>
              )}

              {/* Text Content Section */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-gray-800 text-lg font-medium leading-relaxed mb-2">
                    {post.content}
                  </h3>
                </div>

                {/* Footer: Platforms & Date */}
                <div className="flex items-center gap-4 pt-2 mt-2">
                  <div className="flex -space-x-2">
                    {post.platforms.map(p => (
                      <div key={p} className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm relative z-10">
                        <PlatformIcon platform={p} />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted font-medium flex items-center gap-1.5">
                    {post.status === 'scheduled' ? <Calendar size={14} /> : <Clock size={14} />}
                    {post.date}
                  </span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-green-100 text-green-700 border-green-200",
    scheduled: "bg-blue-100 text-blue-700 border-blue-200",
    failed: "bg-red-100 text-red-700 border-red-200",
  };

  const icons = {
    published: <CheckCircle2 size={12} className="mr-1.5" />,
    scheduled: <Clock size={12} className="mr-1.5" />,
    failed: <AlertCircle size={12} className="mr-1.5" />,
  };

  const labels = {
    published: "Published",
    scheduled: "Scheduled",
    failed: "Failed",
  };

  return (
    // @ts-ignore
    <span className={`flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {/* @ts-ignore */}
      {icons[status]}
      {/* @ts-ignore */}
      {labels[status]}
    </span>
  );
}

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'facebook': return <Facebook size={14} className="text-blue-600" />;
    case 'instagram': return <Instagram size={14} className="text-pink-600" />;
    case 'tiktok': return <Video size={14} className="text-black" />;
    case 'x': return <XIcon />;
    default: return <Video size={14} />;
  }
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-3.5 h-3.5 fill-current text-black">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}