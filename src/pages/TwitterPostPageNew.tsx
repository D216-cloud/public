"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/dashboard-header";
import { toast } from "@/hooks/use-toast";
import {
  ImageIcon,
  Smile,
  Calendar,
  MapPin,
  BarChart3,
  MessageCircle,
  Heart,
  Share,
  Send,
  X,
  Sparkles,
  Loader2,
  CheckCircle,
  Clock,
  Wand2,
  ChevronDown,
  ChevronUp,
  Video,
  Upload,
  CheckCircle2,
  Twitter,
  RotateCcw
} from "lucide-react";

// Emoji data
const EMOJIS = [
  '😀', '😂', '🥰', '😎', '🤩', '😍', '🤗', '🤑', '🤠', '🥳',
  '😭', '😡', '🤯', '🥶', '😱', '👻', '👾', '🤖', '👋', '👍',
  '👏', '🙌', '💪', '🦾', '🦿', '🧠', '👀', '👁️', '👂', '👃',
  '👄', '👅', '🔥', '💥', '✨', '🌟', '💫', '💯', '❤️', '💖',
  '💘', '💝', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '🤎',
  '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
  '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦄',
  '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂',
  '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀',
  '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆',
  '🦓', '🦍', '🦧', '🦣', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒',
  '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙',
  '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜',
  '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫', '🦦', '🦥',
  '🐁', '🐀', '🐿️', '🦔', '🌵', '🎄', '🌲', '🌳', '🌴', '🪵',
  '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '互利', '🍃', '🍂', '🍁',
  '🍄', '🐚', '🪨', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸',
  '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗',
  '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐',
  '💫', '⭐', '🌟', '✨', '⚡', '🔥', '💥', '☄️', '☀️', '🌤️',
  '⛅', '🌥️', '🌦️', '🌈', '☁️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️',
  '☃️', '⛄', '🌬️', '💨', '💧', '💦', '☔', '🦯', '🔥', '🧨',
  '🎈', '🎉', '🎊', '🎁', '🎀', '🎗️', '🎟️', '🎫', '🎖️', '🏆',
  '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈',
  '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸',
  '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷',
  '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🎮', '🕹️',
  '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '♠️', '♥️', '♦️', '♣️',
  '♟️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶',
  '🪢', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣',
  '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙',
  '👚', '👛', '👜', '👝', '🛍️', '🎒', '🩴', '👞', '👟', '🥾',
  '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢',
  '🪖', '💄', 'ERING', '💼', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️',
  '🖱️', '🖲️', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📽️', '🎬',
  '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦',
  '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓',
  '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰',
  '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️',
  '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭',
  '📮', '🗳️', '✏️', '✒️', '🖋️', '.pen', '🖌️', '🖍️', '📝', '💼'
];

// Content tone options
const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "humorous", label: "Humorous" },
  { value: "informative", label: "Informative" },
  { value: "inspirational", label: "Inspirational" },
];

// Content length options
const LENGTH_OPTIONS = [
  { value: "medium", label: "Medium (500-800 chars)" },
  { value: "long", label: "Long (800-1200 chars)" },
  { value: "verylong", label: "Very Long (1200+ chars)" },
];

export default function TwitterPostPage() {
  const [postContent, setPostContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [generatedPost, setGeneratedPost] = useState<{ content: string; images: string[]; videos: string[] } | null>(null);
  const [uploadedImages, setUploadedImages] = useState<{ id: number; url: string }[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<{ id: number; url: string }[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [showLocation, setShowLocation] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [showAIOptions, setShowAIOptions] = useState<boolean>(false);
  const [selectedTone, setSelectedTone] = useState<string>("professional");
  const [selectedLength, setSelectedLength] = useState<string>("medium");
  const [hashtags, setHashtags] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const aiOptionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocation(false);
      }
      if (aiOptionsRef.current && !aiOptionsRef.current.contains(event.target as Node)) {
        setShowAIOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedImages((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: e.target?.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedVideos((prev) => [
            ...prev,
            {
              id: Date.now() + Math.random(),
              url: e.target?.result as string,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (id: number) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeVideo = (id: number) => {
    setUploadedVideos((prev) => prev.filter((video) => video.id !== id));
  };

  const addEmoji = (emoji: string) => {
    setPostContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleGenerate = async () => {
    if (!postContent.trim()) {
      toast({
        title: "Cannot generate",
        description: "Please enter a topic or keyword to generate content",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to generate content');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/generate-content`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: postContent,
          tone: selectedTone,
          length: selectedLength,
          template: "announcement", // Default template
          audience: "general",
          style: "concise",
          purpose: hashtags ? `Include these hashtags: ${hashtags}` : "Create engaging social media content",
          language: "en"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(`Failed to generate content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.content || "Failed to generate content. Please try again.";

      setGeneratedPost({
        content: generatedText,
        images: uploadedImages.map((img) => img.url),
        videos: uploadedVideos.map((video) => video.url),
      });

      toast({
        title: "Content generated!",
        description: `Your post has ${generatedText.length} characters`,
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error generating content",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    const contentToPost = generatedPost?.content || postContent;

    if (!contentToPost.trim() && uploadedImages.length === 0) {
      toast({
        title: "Cannot post",
        description: "Please add some content or images",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to post content');
      }

      // Post directly to Twitter
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/twitter/post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: contentToPost,
          template: "announcement",
          tone: selectedTone,
          length: selectedLength,
          audience: "general",
          style: "concise",
          topic: postContent,
          language: "en"
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to post: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Post response:", data);

      toast({
        title: "Posted successfully!",
        description: "Your post has been published to X (Twitter)",
      });

      // Reset form
      setPostContent("");
      setUploadedImages([]);
      setGeneratedPost(null);
      setScheduledDate("");
      setLocation("");
      setHashtags("");
    } catch (error) {
      console.error("Post error:", error);
      toast({
        title: "Error posting",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  const handleSchedule = async () => {
    const contentToPost = generatedPost?.content || postContent;

    if (!contentToPost.trim() && uploadedImages.length === 0) {
      toast({
        title: "Cannot schedule",
        description: "Please add some content or images",
        variant: "destructive",
      });
      return;
    }

    if (!scheduledDate) {
      toast({
        title: "Cannot schedule",
        description: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    setIsPosting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to schedule content');
      }

      // Schedule the post
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/twitter/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: contentToPost,
          template: "announcement",
          tone: selectedTone,
          length: selectedLength,
          audience: "general",
          style: "concise",
          topic: postContent,
          language: "en",
          scheduledFor: scheduledDate
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to schedule: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Schedule response:", data);

      toast({
        title: "Scheduled successfully!",
        description: `Your post will be published on ${new Date(scheduledDate).toLocaleString()}`,
      });

      setPostContent("");
      setUploadedImages([]);
      setGeneratedPost(null);
      setScheduledDate("");
      setLocation("");
      setHashtags("");
    } catch (error) {
      console.error("Schedule error:", error);
      toast({
        title: "Error scheduling",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
  };

  // New function to refresh posts
  const handleRefresh = async () => {
    // Add refresh functionality here
    console.log("Refreshing posts...");
  };

  const formatContent = (content: string) => {
    return content.split("\n").map((paragraph, index) => (
      <p key={index} className="mb-4 last:mb-0 text-gray-800 leading-relaxed">
        {paragraph}
      </p>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>

      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-5 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 border border-white/20 backdrop-blur-sm">
              <MessageCircle className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 tracking-tight leading-tight">
                Create Post
              </h1>
              <p className="text-gray-600 text-sm sm:text-base font-medium mt-1">Share your thoughts with the world</p>
            </div>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="bg-white/80 backdrop-blur-xl border-2 border-white/30 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <RotateCcw className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700" />
          </Button>
        </div>

        {/* Loading Animation */}
        {isGenerating && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl mb-8 sm:mb-12 p-6 sm:p-8 lg:p-10 transition-all duration-500 border border-white/20">
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Sparkles className="h-8 w-8 text-purple-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mt-6">Generating your post...</h3>
              <p className="text-gray-600 mt-2">This usually takes 5-10 seconds</p>
              <div className="w-64 h-2 bg-gray-200 rounded-full mt-6 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* AI Content Generation Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl mb-8 sm:mb-12 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30 group">
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-3 sm:p-4 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                <Wand2 className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 tracking-tight">AI Content Generator</h2>
                <p className="text-gray-600 text-sm sm:text-base font-medium mt-1">Let AI craft your perfect post</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAIOptions(!showAIOptions)}
              className="text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-purple-200/50"
            >
              {showAIOptions ? <ChevronUp className="h-6 w-6 sm:h-8 sm:w-8" /> : <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8" />}
            </Button>
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
              Topic or Keyword
            </label>
            <Textarea
              placeholder="Enter your topic, idea, or keyword for content generation (e.g., 'artificial intelligence', 'healthy recipes', 'productivity tips')..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              className="w-full border-2 border-gray-200/50 p-5 sm:p-7 rounded-2xl sm:rounded-3xl resize-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 min-h-[120px] sm:min-h-[140px] text-gray-900 placeholder-gray-400 text-lg sm:text-xl font-medium transition-all duration-300 hover:border-purple-300/50 bg-white/50 backdrop-blur-sm shadow-lg hover:shadow-xl"
            />
          </div>

          {showAIOptions && (
            <div
              ref={aiOptionsRef}
              className="mb-8 sm:mb-10 p-6 sm:p-8 bg-gradient-to-br from-gray-50/80 via-blue-50/60 to-purple-50/60 rounded-2xl sm:rounded-3xl shadow-inner backdrop-blur-sm border border-white/30 transition-all duration-500"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3">Tone</label>
                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-purple-300/50 shadow-lg text-base sm:text-lg font-medium"
                  >
                    {TONE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-base font-bold text-gray-800 mb-3">Length</label>
                  <select
                    value={selectedLength}
                    onChange={(e) => setSelectedLength(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-purple-300/50 shadow-lg text-base sm:text-lg font-medium"
                  >
                    {LENGTH_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-base font-bold text-gray-800 mb-3">
                    Hashtags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    placeholder="#ai, #technology, #innovation"
                    className="w-full p-4 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-purple-300/50 shadow-lg text-base sm:text-lg font-medium"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="text-base font-bold text-gray-700 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {postContent.length} characters
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !postContent.trim()}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white rounded-2xl px-6 sm:px-10 py-4 font-bold flex items-center shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm text-base sm:text-lg w-full sm:w-auto"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 sm:h-7 sm:w-7 animate-spin" />
                  <span className="hidden sm:inline ml-3">Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 sm:h-7 sm:w-7" />
                  <span className="hidden sm:inline ml-3">Generate with AI</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Post Composer */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl mb-8 sm:mb-12 p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30 group">
          <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 lg:space-x-8">
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-4 border-white shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-6 group-hover:rotate-12">
                <span className="text-white font-black text-xl sm:text-3xl drop-shadow-lg">U</span>
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <Textarea
                placeholder="What's happening?!"
                value={generatedPost?.content || postContent}
                onChange={(e) => {
                  if (generatedPost) {
                    setGeneratedPost({ ...generatedPost, content: e.target.value });
                  } else {
                    setPostContent(e.target.value);
                  }
                }}
                className="w-full border-0 p-0 resize-none focus:ring-0 text-xl sm:text-2xl min-h-[120px] sm:min-h-[160px] placeholder-gray-400 text-gray-900 font-bold tracking-tight leading-relaxed"
              />

              {uploadedImages.length > 0 && !generatedPost && (
                <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt="Preview"
                        className="rounded-xl sm:rounded-2xl object-cover w-full h-32 sm:h-48 transition-all duration-500 group-hover:brightness-90 shadow-md"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                      >
                        <X className="h-4 w-4 sm:h-6 sm:w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedVideos.length > 0 && !generatedPost && (
                <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                  {uploadedVideos.map((video) => (
                    <div key={video.id} className="relative group">
                      <video
                        src={video.url}
                        className="rounded-xl sm:rounded-2xl object-cover w-full h-32 sm:h-48 transition-all duration-500 group-hover:brightness-90 shadow-md"
                        controls
                      />
                      <button
                        onClick={() => removeVideo(video.id)}
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 h-8 w-8 sm:h-10 sm:w-10 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-sm"
                      >
                        <X className="h-4 w-4 sm:h-6 sm:w-6" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {location && (
                <div className="mt-4 sm:mt-5 flex items-center text-blue-600">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3" />
                  <span className="text-sm sm:text-base font-semibold">{location}</span>
                </div>
              )}

              <div className="mt-6 sm:mt-8 flex justify-between items-center">
                <span
                  className={`text-lg sm:text-xl font-black ${
                    postContent.length > 280 ? "text-red-500" : "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  }`}
                >
                  {postContent.length}/280
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200/50 mt-8 sm:mt-10 pt-6 sm:pt-8">
            <div className="flex space-x-4 sm:space-x-6 relative mb-6 sm:mb-8">
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30"
                onClick={() => videoInputRef.current?.click()}
              >
                <Video className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-purple-600 hover:text-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-white hover:bg-gradient-to-r hover:from-green-500 hover:to-blue-500 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30"
                onClick={() => setShowCalendar(!showCalendar)}
              >
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-orange-600 hover:text-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30"
                onClick={() => setShowLocation(!showLocation)}
              >
                <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-white hover:bg-gradient-to-r hover:from-gray-500 hover:to-slate-500 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30"
              >
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8" />
              </Button>

              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-20 sm:bottom-24 left-0 z-50 bg-white/95 backdrop-blur-xl border-2 border-white/30 rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 w-96 sm:w-[28rem] h-[28rem] sm:h-[32rem] overflow-y-auto transition-all duration-500 transform scale-95 origin-bottom-left"
                >
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-3 sm:gap-4">
                    {EMOJIS.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl sm:text-3xl p-3 sm:p-4 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-2xl transition-all duration-3