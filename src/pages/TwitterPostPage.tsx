"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DashboardHeader } from "@/components/dashboard-header";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
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
  Twitter,
  AlertCircle,
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
  '🌱', '🌿', '☘️', '🍀', '🎍', '🪴', '🎋', '🍃', '🍂', '🍁',
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
  '🪖', '💄', '💍', '💼', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️',
  '🖱️', '🖲️', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📽️', '🎬',
  '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦',
  '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓',
  '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰',
  '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️',
  '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭',
  '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼'
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
  { value: "short", label: "Short (under 140 chars)" },
  { value: "medium", label: "Medium (140-200 chars)" },
  { value: "long", label: "Long (200-280 chars)" },
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
  const [autoPostEnabled, setAutoPostEnabled] = useState<boolean>(false);
  const [twitterConnected, setTwitterConnected] = useState<boolean | null>(null);
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

  useEffect(() => {
    checkTwitterConnection();
  }, []);

  const checkTwitterConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No auth token found');
        return;
      }

      console.log('Checking Twitter connection...');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/twitter-setup/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      console.log('Twitter connection status response:', data);
      
      setTwitterConnected(data.connected || false);
      
      if (!data.connected) {
        console.warn('Twitter not connected:', data.message);
      } else {
        console.log('Twitter connected successfully:', data.twitterUser);
      }
    } catch (error) {
      console.error('Error checking Twitter connection:', error);
      setTwitterConnected(false);
    }
  };

  // Add a test function for debugging Twitter connection
  const testTwitterConnection = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        toast({
          title: "Authentication Error",
          description: "No auth token found. Please log in again.",
          variant: "destructive",
        });
        return;
      }

      console.log('=== DEBUGGING TWITTER CONNECTION ===');
      toast({
        title: "Debugging Connection",
        description: "Checking your Twitter connection details...",
      });

      // First, get debug info
      const debugResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/debug-twitter-connection`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const debugData = await debugResponse.json();
      console.log('=== DEBUG RESULTS ===');
      console.log('Full debug data:', debugData);
      
      if (debugData.success) {
        const { debug } = debugData;
        console.log(`User ID: ${debug.userId}`);
        console.log(`Total connections: ${debug.totalConnections}`);
        console.log('Connections:', debug.connections);
        
        if (debug.totalConnections === 0) {
          toast({
            title: "No Connections Found",
            description: "You have no Twitter connections in the database. Please connect your Twitter account in Settings.",
            variant: "destructive",
          });
          return;
        }
        
        // Try to post
        console.log('=== ATTEMPTING TO POST ===');
        const testContent = "🔥 Test post from my awesome social media tool! #test #api";
        
        const postResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/post-to-x`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: testContent,
            template: "announcement",
            tone: "casual",
            length: "short",
            audience: "general",
            style: "concise",
            topic: "test",
            language: "en"
          }),
        });

        const postData = await postResponse.json();
        console.log('Post response:', postData);
        
        if (postResponse.ok) {
          toast({
            title: "SUCCESS! 🎉",
            description: `Test post successful! Tweet ID: ${postData.tweetId}`,
          });
        } else {
          toast({
            title: "Post Failed",
            description: postData.message || 'Unknown error',
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Debug Failed",
          description: debugData.error || 'Unknown error',
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Test connection error:', error);
      toast({
        title: "Test Failed",
        description: "Error testing Twitter connection",
        variant: "destructive",
      });
    }
  };

  // Make test function available in console for debugging
  React.useEffect(() => {
    (window as any).testTwitterConnection = testTwitterConnection;
    console.log('Debug: testTwitterConnection() function available in console');
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
        description: "Please enter a topic or idea first",
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

      // Use auto-post endpoint if auto-posting is enabled
      const endpoint = autoPostEnabled 
        ? `${import.meta.env.VITE_API_URL}/api/posts/auto-post-generated`
        : `${import.meta.env.VITE_API_URL}/api/posts/generate-content`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          topic: postContent,
          tone: selectedTone,
          length: selectedLength,
          template: "announcement",
          audience: "general",
          style: "concise",
          purpose: hashtags ? `Include these hashtags: ${hashtags}` : "Create engaging social media content",
          language: "en",
          autoPost: autoPostEnabled,
          content: postContent
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        
        // Handle Twitter connection requirement for auto-posting
        if (errorData.requiresTwitterConnection) {
          throw new Error(`${errorData.message} Please go to Settings to connect your Twitter account.`);
        }
        
        throw new Error(errorData.message || `Failed to generate content: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const generatedText = data.content || "Failed to generate content. Please try again.";

      setGeneratedPost({
        content: generatedText,
        images: uploadedImages.map((img) => img.url),
        videos: uploadedVideos.map((video) => video.url),
      });

      if (data.autoPosted) {
        toast({
          title: "🚀 Content generated and posted!",
          description: `Your post has been automatically published to X (Twitter) and email notification sent! (${data.characterCount} characters)`,
        });
        
        // Reset form since content was auto-posted
        setPostContent("");
        setUploadedImages([]);
        setGeneratedPost(null);
        setScheduledDate("");
        setLocation("");
        setHashtags("");
      } else if (autoPostEnabled && data.error) {
        // Auto-posting was attempted but failed
        toast({
          title: "⚠️ Content generated, auto-post failed",
          description: data.error.includes('Twitter') ? 
            `${data.error} You can still post manually.` : 
            `Auto-posting failed: ${data.error}`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "✨ Content generated!",
          description: `Your post has ${data.characterCount || generatedText.length} characters`,
        });
      }
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

      // Post directly to Twitter using the real API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/post-to-x`, {
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
        console.error('Post failed with error data:', errorData);
        
        // Handle Twitter connection requirement
        if (errorData.requiresTwitterConnection) {
          throw new Error(`${errorData.message} Please go to Settings to connect your Twitter account.`);
        }
        
        // Provide detailed error message
        const errorMessage = errorData.message || `Failed to post: ${response.status} ${response.statusText}`;
        console.error('Detailed error:', {
          status: response.status,
          statusText: response.statusText,
          errorData: errorData
        });
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Post response:", data);

      toast({
        title: "Posted successfully!",
        description: "Your post has been published to X (Twitter) and email notification sent!",
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
      await new Promise((resolve) => setTimeout(resolve, 1500));

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
      toast({
        title: "Error scheduling",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsPosting(false);
    }
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
        <div className="flex items-center space-x-3 sm:space-x-4 mb-8 sm:mb-12">
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

                <div className="sm:col-span-2">
                  <label className="flex items-center text-base font-bold text-gray-800 mb-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoPostEnabled}
                      onChange={(e) => setAutoPostEnabled(e.target.checked)}
                      className="mr-3 w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span>🚀 Auto-post generated content immediately</span>
                  </label>
                  <p className="text-sm text-gray-600 ml-8">
                    When enabled, generated content will be automatically posted to X (Twitter) and you'll receive an email notification.
                  </p>
                  <div className="ml-8 mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      💡 <strong>Note:</strong> Auto-posting requires a connected Twitter account. If you haven't connected your Twitter account yet, please go to Settings → Social Accounts to connect it first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div className="flex flex-col gap-1">
              <div className={`text-base font-bold ${postContent.length > 280 ? 'text-red-600' : postContent.length > 250 ? 'text-yellow-600' : 'text-gray-700'} bg-gradient-to-r ${postContent.length > 280 ? 'from-red-600 to-red-800' : postContent.length > 250 ? 'from-yellow-600 to-orange-600' : 'from-purple-600 to-pink-600'} bg-clip-text text-transparent`}>
                {postContent.length} / 280 characters
              </div>
              {postContent.length > 280 && (
                <div className="text-sm text-red-600 font-medium">
                  ⚠️ Too long for Twitter! Please shorten by {postContent.length - 280} characters.
                </div>
              )}
              {postContent.length > 250 && postContent.length <= 280 && (
                <div className="text-sm text-yellow-600 font-medium">
                  ⚡ Close to limit! {280 - postContent.length} characters remaining.
                </div>
              )}
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
              
              {/* Character count for textarea */}
              <div className={`mt-2 text-sm font-bold ${(generatedPost?.content || postContent).length > 280 ? 'text-red-600' : (generatedPost?.content || postContent).length > 250 ? 'text-yellow-600' : 'text-gray-600'}`}>
                {(generatedPost?.content || postContent).length} / 280 characters
                {(generatedPost?.content || postContent).length > 280 && (
                  <span className="ml-2 text-red-600">⚠️ Too long for Twitter!</span>
                )}
                {(generatedPost?.content || postContent).length > 250 && (generatedPost?.content || postContent).length <= 280 && (
                  <span className="ml-2 text-yellow-600">⚡ Close to limit</span>
                )}
              </div>

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
                        className="text-2xl sm:text-3xl p-3 sm:p-4 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 rounded-2xl transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 shadow-lg hover:shadow-xl border border-transparent hover:border-purple-200/50"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {showCalendar && (
                <div
                  ref={calendarRef}
                  className="absolute bottom-20 sm:bottom-24 left-8 sm:left-16 z-50 bg-white/95 backdrop-blur-xl border-2 border-white/30 rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 w-96 sm:w-[32rem] transition-all duration-500 transform scale-95 origin-bottom-left"
                >
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-3 shadow-xl">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="font-black text-xl sm:text-2xl text-gray-900">Schedule Post</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCalendar(false)}
                      className="h-10 w-10 sm:h-12 sm:w-12 p-0 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-red-200/50"
                    >
                      <X className="h-6 w-6 sm:h-8 sm:w-8" />
                    </Button>
                  </div>
                  <input
                    type="datetime-local"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-400/50 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-green-300/50 shadow-lg text-base sm:text-lg font-medium"
                  />
                  <Button
                    onClick={handleSchedule}
                    disabled={isPosting || !scheduledDate}
                    className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-2xl py-4 sm:py-5 font-bold shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm text-base sm:text-lg"
                  >
                    {isPosting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 sm:h-7 sm:w-7 animate-spin mr-3" />
                        Scheduling...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Clock className="h-6 w-6 mr-3" />
                        Schedule
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {showLocation && (
                <div
                  ref={locationRef}
                  className="absolute bottom-24 left-40 z-50 bg-white/95 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-2xl p-6 sm:p-8 w-96 sm:w-[28rem] transition-all duration-500 transform scale-95 origin-bottom-left"
                >
                  <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-3 shadow-xl">
                        <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h3 className="font-black text-xl sm:text-2xl text-gray-900">Add Location</h3>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLocation(false)}
                      className="h-10 w-10 sm:h-12 sm:w-12 p-0 text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-red-200/50"
                    >
                      <X className="h-6 w-6 sm:h-8 sm:w-8" />
                    </Button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search for a location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-4 sm:p-5 border-2 border-gray-200/50 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400/50 bg-white/80 backdrop-blur-sm text-gray-800 transition-all duration-300 hover:border-orange-300/50 shadow-lg text-base sm:text-lg font-medium"
                  />
                  <Button
                    onClick={() => setShowLocation(false)}
                    className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-2xl py-4 sm:py-5 font-bold shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(249,115,22,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm text-base sm:text-lg"
                  >
                    Save Location
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8">
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !postContent.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white rounded-2xl px-6 sm:px-10 py-4 font-bold flex items-center justify-center shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm text-base sm:text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 sm:h-7 sm:w-7 animate-spin mr-3" />
                    <span className="hidden sm:inline">Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 sm:h-7 sm:w-7 mr-3" />
                    <span className="hidden sm:inline">Generate</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handlePost}
                disabled={isPosting || (!postContent.trim() && uploadedImages.length === 0 && !generatedPost)}
                className="flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl px-6 sm:px-10 py-4 font-bold flex items-center justify-center shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm text-base sm:text-lg"
              >
                {isPosting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 sm:h-7 sm:w-7 animate-spin mr-0 sm:mr-3" />
                    <span className="hidden sm:inline">Posting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-5 w-5 sm:h-7 sm:w-7 mr-0 sm:mr-3" />
                    <span className="hidden sm:inline">Post</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />

        {generatedPost && (
          <div className="w-[95%] mx-auto sm:w-full bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl overflow-hidden transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30">
            <div className="p-4 sm:p-10 bg-gradient-to-r from-purple-50/80 via-pink-50/60 to-orange-50/60 border-b border-white/30 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3 sm:space-x-5">
                  <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-2xl p-4 sm:p-5 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-12">
                    <Sparkles className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">AI Generated Post</h2>
                    <p className="text-gray-600 text-sm sm:text-base font-medium mt-1">Ready to share with your audience</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setGeneratedPost(null)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl p-3 sm:p-4 transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-red-200/50"
                >
                  <X className="h-6 w-6 sm:h-8 sm:w-8" />
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-10">
              <div className="flex space-x-4 sm:space-x-8">
                <div className="flex-shrink-0">
                  <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 rounded-2xl w-12 h-12 sm:w-20 sm:h-20 flex items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-6 border-4 border-white">
                    <span className="text-white font-black text-lg sm:text-3xl drop-shadow-lg">AI</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center mb-4 sm:mb-8">
                    <span className="font-black text-gray-900 text-lg sm:text-2xl">AI Assistant</span>
                    <span className="mx-2 sm:mx-4 text-gray-400 text-lg">·</span>
                    <span className="text-gray-600 text-sm sm:text-lg font-semibold">Just now</span>
                    <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 ml-3 sm:ml-4 drop-shadow-lg" />
                  </div>

                  <div className="text-gray-900 mb-4 sm:mb-8 leading-relaxed text-base sm:text-xl font-bold tracking-tight">
                    {formatContent(generatedPost.content)}
                  </div>

                  {location && (
                    <div className="flex items-center text-blue-600 mb-6">
                      <MapPin className="h-6 w-6 mr-3" />
                      <span className="text-base font-semibold">{location}</span>
                    </div>
                  )}

                  {generatedPost.images.length > 0 && (
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {generatedPost.images.map((imageUrl, index) => (
                        <div key={index} className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                          <img
                            src={imageUrl}
                            alt="Generated post"
                            className="w-full h-64 object-cover transition-all duration-500 hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 sm:pt-6 sm:pt-8 border-t border-gray-200/50">
                    <div className="flex items-center space-x-6 sm:space-x-8 sm:space-x-12">
                      <div className="flex items-center text-gray-600 text-sm sm:text-base sm:text-lg hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 font-semibold">
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:h-8 mr-1 sm:mr-2 sm:mr-3" />
                        <span>24</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base sm:text-lg hover:text-red-500 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 font-semibold">
                        <Heart className="h-5 w-5 sm:h-6 sm:h-8 mr-1 sm:mr-2 sm:mr-3" />
                        <span>142</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm sm:text-base sm:text-lg hover:text-blue-600 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 font-semibold">
                        <Share className="h-5 w-5 sm:h-6 sm:h-8 mr-1 sm:mr-2 sm:mr-3" />
                        <span>12</span>
                      </div>
                    </div>

                    <div className={`flex items-center text-sm sm:text-base sm:text-lg font-black ${generatedPost.content.length > 280 ? 'text-red-600' : generatedPost.content.length > 250 ? 'text-yellow-600' : 'text-green-600'} bg-gradient-to-r ${generatedPost.content.length > 280 ? 'from-red-600 to-red-800' : generatedPost.content.length > 250 ? 'from-yellow-600 to-orange-600' : 'from-green-600 to-blue-600'} bg-clip-text text-transparent`}>
                      <CheckCircle className="h-5 w-5 sm:h-6 sm:h-8 mr-1 sm:mr-2 sm:mr-3 drop-shadow-lg" />
                      <span>{generatedPost.content.length} / 280 chars</span>
                      {generatedPost.content.length > 280 && (
                        <span className="ml-2 text-red-600 text-xs">⚠️ Too long!</span>
                      )}
                      {generatedPost.content.length > 250 && generatedPost.content.length <= 280 && (
                        <span className="ml-2 text-yellow-600 text-xs">⚡ Close to limit</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-10 bg-gradient-to-r from-gray-50/80 via-blue-50/60 to-purple-50/60 border-t border-white/30 backdrop-blur-sm">
              <Button
                onClick={handlePost}
                disabled={isPosting}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl py-4 sm:py-5 font-black shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm text-lg sm:text-xl"
              >
                {isPosting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" />
                    <span className="hidden sm:inline ml-0 sm:ml-4">Posting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Send className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span className="hidden sm:inline ml-0 sm:ml-4">Post Now</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        multiple
        onChange={handleVideoUpload}
        className="hidden"
      />
    </div>
  );
}