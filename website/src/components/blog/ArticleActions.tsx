"use client";

import { useState, useEffect } from "react";
import { Bookmark, Share2, Check } from "lucide-react";

export function ArticleActions({ articleTitle, articleSlug }: { articleTitle: string, articleSlug: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    // Check if bookmarked in localStorage
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      const bookmarks = JSON.parse(saved);
      if (bookmarks.includes(articleSlug)) {
        setIsBookmarked(true);
      }
    }
  }, [articleSlug]);

  const toggleBookmark = () => {
    const saved = localStorage.getItem("bookmarks");
    let bookmarks: string[] = saved ? JSON.parse(saved) : [];
    
    if (isBookmarked) {
      bookmarks = bookmarks.filter(s => s !== articleSlug);
      setIsBookmarked(false);
    } else {
      bookmarks.push(articleSlug);
      setIsBookmarked(true);
    }
    
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: articleTitle,
          url: url
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(url);
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={toggleBookmark}
        className={`cursor-pointer w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${isBookmarked ? 'bg-teal-50 border-teal-200 text-teal-600' : 'border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50'}`}
        title={isBookmarked ? "Remove Bookmark" : "Bookmark"}
      >
        <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
      </button>
      <button 
        onClick={handleShare}
        className="cursor-pointer w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
        title="Share"
      >
        {isShared ? <Check className="w-4 h-4 text-teal-600" /> : <Share2 className="w-4 h-4" />}
      </button>
    </div>
  );
}
