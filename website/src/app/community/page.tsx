"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users2, MessageSquare, Search, PlusCircle, 
  ThumbsUp, CheckCircle2, TrendingUp, HelpCircle, 
  MonitorPlay, Megaphone, Zap, GraduationCap, ChevronRight, X
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { name: "General Discussion", icon: MessageSquare, count: 853 },
  { name: "Faculty Tips", icon: GraduationCap, count: 421 },
  { name: "Student Success", icon: Users2, count: 219 },
  { name: "SmartBoard", icon: MonitorPlay, count: 642 },
  { name: "Feature Requests", icon: Zap, count: 184 },
  { name: "API & Integrations", icon: Search, count: 356 },
  { name: "Announcements", icon: Megaphone, count: 42 },
  { name: "Showcase", icon: ThumbsUp, count: 89 },
];

const INITIAL_DISCUSSIONS = [
  { 
    id: 1,
    title: "How universities use SmartBoard for interactive polls",
    category: "SmartBoard",
    author: "Prof. Sarah Jenkins",
    replies: 34,
    likes: 156,
    solved: true,
    time: "2 hours ago",
    content: "We've been using SmartBoards for a month now and polls are a game changer!"
  },
  { 
    id: 2,
    title: "Improving attendance accuracy with geo-fencing",
    category: "Faculty Tips",
    author: "David Chen, IT Admin",
    replies: 12,
    likes: 89,
    solved: false,
    time: "5 hours ago",
    content: "What radius are you all using for the geo-fencing feature on campus?"
  },
  { 
    id: 3,
    title: "Best faculty workflows for end-of-semester reporting",
    category: "General Discussion",
    author: "Dr. Robert Smith",
    replies: 45,
    likes: 210,
    solved: true,
    time: "1 day ago",
    content: "Just wanted to share a quick script I wrote that pulls API data for grading."
  },
  { 
    id: 4,
    title: "Campus analytics dashboard completely transformed our ROI",
    category: "Showcase",
    author: "Emily White, Dean",
    replies: 8,
    likes: 67,
    solved: false,
    time: "2 days ago",
    content: "The new analytics view gives us insight into exactly where resources are needed."
  },
  { 
    id: 5,
    title: "Student engagement ideas using push notifications",
    category: "Student Success",
    author: "Marcus Johnson",
    replies: 22,
    likes: 114,
    solved: true,
    time: "3 days ago",
    content: "Sending reminders 15 mins before class has boosted attendance by 12%!"
  }
];

export default function CommunityPage() {
  const [discussions, setDiscussions] = useState(INITIAL_DISCUSSIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("General Discussion");
  const [newPostContent, setNewPostContent] = useState("");
  
  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);

  // Like & Reply State
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [replyingToId, setReplyingToId] = useState<number | null>(null);
  const [replyInput, setReplyInput] = useState("");

  const handleLike = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (likedPosts.includes(id)) {
      setLikedPosts(prev => prev.filter(p => p !== id));
      setDiscussions(prev => prev.map(d => d.id === id ? { ...d, likes: d.likes - 1 } : d));
    } else {
      setLikedPosts(prev => [...prev, id]);
      setDiscussions(prev => prev.map(d => d.id === id ? { ...d, likes: d.likes + 1 } : d));
    }
  };

  const handleReplySubmit = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!replyInput.trim()) return;

    setDiscussions(prev => prev.map(d => {
      if (d.id === id) {
        return {
          ...d,
          replies: d.replies + 1,
          replyList: [...((d as any).replyList || []), { author: "You", content: replyInput, time: "Just now" }]
        };
      }
      return d;
    }));
    setReplyInput("");
    setReplyingToId(null);
  };

  // Filtered list
  const filteredDiscussions = discussions.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          d.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory ? d.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim()) return;

    const newPost = {
      id: Date.now(),
      title: newPostTitle,
      category: newPostCategory,
      author: "You (Demo User)",
      replies: 0,
      likes: 0,
      solved: false,
      time: "Just now",
      content: newPostContent
    };

    setDiscussions([newPost, ...discussions]);
    setIsModalOpen(false);
    setNewPostTitle("");
    setNewPostContent("");
    
    // Switch to the category we just posted in
    setActiveCategory(newPostCategory);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Ask Question Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2">Ask the Community</h2>
              <p className="text-slate-500 mb-6">Get answers from educators, developers, and admins.</p>
              
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">Title</label>
                  <input 
                    required 
                    value={newPostTitle}
                    onChange={e => setNewPostTitle(e.target.value)}
                    type="text" 
                    placeholder="E.g., How do I export attendance logs?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">Category</label>
                  <select 
                    value={newPostCategory}
                    onChange={e => setNewPostCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900 appearance-none"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-[#0F172A]">Details</label>
                  <textarea 
                    rows={4}
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    placeholder="Provide some context or background..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-slate-900" 
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-primary/90 transition-all flex items-center gap-2"
                  >
                    Post Question
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none"></div>
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white font-medium text-sm mb-4 border border-white/20"
              >
                <Users2 className="w-4 h-4 text-emerald-400" />
                IntelliAttend Community
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4"
              >
                Connect and Collaborate
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/70 max-w-2xl"
              >
                Join thousands of educators, administrators, and developers sharing knowledge, asking questions, and building the future of campus management.
              </motion.p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative max-w-3xl"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search discussions, tutorials, and announcements..." 
              className="w-full bg-white text-[#0F172A] rounded-2xl pl-12 pr-24 py-4 shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/20 border-none text-lg placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-4 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-6 py-4 justify-between md:justify-start md:gap-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#0F172A]">15K+</div>
              <div className="text-sm text-slate-500 font-medium">Members</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#0F172A]">2K+</div>
              <div className="text-sm text-slate-500 font-medium">Discussions</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-[#0F172A]">8K+</div>
              <div className="text-sm text-slate-500 font-medium">Answers</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-emerald-500">98%</div>
              <div className="text-sm text-slate-500 font-medium">Solved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar: Categories */}
            <div className="lg:col-span-3 space-y-2 sticky top-28">
              <div className="flex items-center justify-between mb-4 px-3">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Categories</h3>
                {activeCategory && (
                  <button onClick={() => setActiveCategory(null)} className="text-xs font-bold text-primary hover:underline">
                    Clear
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => setActiveCategory(null)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl transition-all group border",
                  !activeCategory 
                    ? "bg-white border-primary/20 shadow-sm text-primary" 
                    : "border-transparent hover:bg-white hover:border-slate-100 text-slate-600"
                )}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={cn("w-5 h-5", !activeCategory ? "text-primary" : "text-slate-400 group-hover:text-primary transition-colors")} />
                  <span className="font-bold text-sm">All Discussions</span>
                </div>
              </button>

              {CATEGORIES.map((cat, i) => {
                const isActive = activeCategory === cat.name;
                return (
                  <button 
                    key={i} 
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all group border",
                      isActive 
                        ? "bg-white border-primary/20 shadow-sm text-primary" 
                        : "border-transparent hover:bg-white hover:border-slate-100 text-slate-600 hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-slate-400 group-hover:text-primary")} />
                      <span className={cn("text-sm", isActive ? "font-bold" : "font-medium")}>{cat.name}</span>
                    </div>
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      isActive ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500 group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Main Feed: Discussions */}
            <div className="lg:col-span-9 space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold text-[#0F172A]">
                    {searchQuery ? `Search Results for "${searchQuery}"` : (activeCategory ? `${activeCategory} Discussions` : "Trending Discussions")}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="bg-primary text-white text-sm font-bold py-2 px-5 rounded-lg shadow-sm hover:bg-primary/90 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Ask a Question
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <AnimatePresence>
                  {filteredDiscussions.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-12 text-center text-slate-500"
                    >
                      <Search className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <h3 className="text-lg font-bold text-[#0F172A] mb-2">No discussions found</h3>
                      <p>Try adjusting your search or selecting a different category.</p>
                      <button 
                        onClick={() => { setSearchQuery(""); setActiveCategory(null); }}
                        className="mt-4 text-primary font-bold hover:underline"
                      >
                        Clear all filters
                      </button>
                    </motion.div>
                  ) : (
                    filteredDiscussions.map((discussion, i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        key={discussion.id} 
                        className="border-b border-slate-100 last:border-b-0"
                      >
                        <div 
                          onClick={() => setExpandedPostId(expandedPostId === discussion.id ? null : discussion.id)}
                          className="p-4 sm:p-5 hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col sm:flex-row gap-4"
                        >
                          <div className="flex gap-4 flex-1">
                            {/* Avatar / Vote */}
                            <div className="flex flex-col items-center gap-2 pt-1 shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-sm">
                                {discussion.author.charAt(0)}
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-2">
                                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-primary transition-colors leading-snug pr-4">
                                  {discussion.title}
                                </h3>
                                {discussion.solved && (
                                  <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Solved
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span 
                                  onClick={(e) => { e.stopPropagation(); setActiveCategory(discussion.category); }}
                                  className="font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-600 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors cursor-pointer"
                                >
                                  {discussion.category}
                                </span>
                                <span className="font-medium text-slate-400">By {discussion.author}</span>
                                <span className="text-slate-300">•</span>
                                <span>{discussion.time}</span>
                              </div>

                              {/* Expanded Content View */}
                              <AnimatePresence>
                                {expandedPostId === discussion.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-slate-600 text-sm leading-relaxed cursor-default" onClick={e => e.stopPropagation()}>
                                      {discussion.content || "No details provided."}
                                      
                                      <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                                        <button 
                                          onClick={(e) => { e.stopPropagation(); setReplyingToId(replyingToId === discussion.id ? null : discussion.id); }}
                                          className="text-primary font-bold text-xs hover:underline cursor-pointer"
                                        >
                                          Reply
                                        </button>
                                        <button 
                                          onClick={(e) => handleLike(e, discussion.id)}
                                          className={cn("font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer", likedPosts.includes(discussion.id) ? "text-primary" : "text-slate-400 hover:text-[#0F172A]")}
                                        >
                                          <ThumbsUp className={cn("w-3.5 h-3.5", likedPosts.includes(discussion.id) && "fill-primary")} /> Like ({discussion.likes})
                                        </button>
                                      </div>

                                      {/* Mock Replies List */}
                                      {(discussion as any).replyList?.length > 0 && (
                                        <div className="mt-4 space-y-3">
                                          {(discussion as any).replyList.map((reply: any, idx: number) => (
                                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                              <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-xs text-[#0F172A]">{reply.author}</span>
                                                <span className="text-[10px] text-slate-400">{reply.time}</span>
                                              </div>
                                              <p className="text-xs text-slate-600">{reply.content}</p>
                                            </div>
                                          ))}
                                        </div>
                                      )}

                                      {/* Reply Input */}
                                      <AnimatePresence>
                                        {replyingToId === discussion.id && (
                                          <motion.form 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onSubmit={(e) => handleReplySubmit(e, discussion.id)}
                                            className="mt-3 flex gap-2 overflow-hidden"
                                          >
                                            <input 
                                              autoFocus
                                              type="text" 
                                              value={replyInput}
                                              onChange={e => setReplyInput(e.target.value)}
                                              placeholder="Write a reply..." 
                                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-[#0F172A]"
                                            />
                                            <button type="submit" disabled={!replyInput.trim()} className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-50">
                                              Post
                                            </button>
                                          </motion.form>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-row sm:flex-col justify-end sm:justify-center items-center gap-6 sm:gap-2 text-sm text-slate-500 pt-4 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-100 sm:pl-6 shrink-0 sm:min-w-[120px]">
                            <div className="flex flex-col sm:flex-col items-center gap-1">
                              <span className="font-bold text-[#0F172A]">{discussion.replies}</span>
                              <span className="text-xs">Replies</span>
                            </div>
                            <div className="flex flex-col sm:flex-col items-center gap-1">
                              <span className="font-bold text-[#0F172A]">{discussion.likes}</span>
                              <span className="text-xs">Likes</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
              
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
