"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  MapPin, 
  Link as LinkIcon, 
  CalendarDays,
  UserCheck,
  Users,
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  Image as ImageIcon,
  BarChart3,
  MoreHorizontal,
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  List,
  User,
  MoreHorizontal as MoreIcon,
  ArrowLeft,
  Settings,
  PenTool,
  TrendingUp,
  Zap
} from "lucide-react"
import { API_URL } from "@/utils/config"
import { Header } from "@/components/header"

interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  profileImage?: string | null;
  twitterConnected?: boolean;
  twitterUsername?: string;
  twitterId?: string;
  twitterProfileImageUrl?: string;
}

interface Tweet {
  id: string;
  content: string;
  timestamp: string;
  likes: number;
  retweets: number;
  replies: number;
  image?: string;
}

export default function XProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")
  const [stats, setStats] = useState({
    posts: 0,
    following: 0,
    followers: 0,
    likes: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get user data from localStorage
        const userString = localStorage.getItem('user')
        console.log("User data from localStorage:", userString)
        
        if (userString) {
          const user = JSON.parse(userString)
          setUserData(user)
        }
        
        // Fetch real stats from API
        await fetchUserStats()
        
        // Fetch real tweets from API
        await fetchUserTweets()
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load profile data: " + (error as Error).message)
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("Token from localStorage:", token);
      
      if (!token) {
        setError("No authentication token found. Please log in again.");
        setStats({
          posts: 0,
          following: 0,
          followers: 0,
          likes: 0
        });
        return;
      }

      console.log("Fetching user stats from:", `${API_URL}/api/user/stats`);
      
      // Fetch user stats from API
      const response = await fetch(`${API_URL}/api/user/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Stats response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Stats result:", result);
        if (result.success) {
          setStats({
            posts: result.posts || 0,
            following: result.following || 0,
            followers: result.followers || 0,
            likes: result.likes || 0
          });
          
          // Set info message if there's one
          if (result.message) {
            setInfoMessage(result.message);
          }
        } else {
          console.error("Stats API returned error:", result.message);
          setError("Failed to load stats: " + result.message);
          // Show 0 values
          setStats({
            posts: 0,
            following: 0,
            followers: 0,
            likes: 0
          });
        }
      } else {
        const errorText = await response.text();
        console.error("Stats API error response:", response.status, response.statusText, errorText);
        setError(`Failed to load stats: ${response.status} ${response.statusText} - ${errorText}`);
        // Show 0 values
        setStats({
          posts: 0,
          following: 0,
          followers: 0,
          likes: 0
        });
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setError("Network error while fetching stats: " + (error as Error).message);
      // Show 0 values
      setStats({
        posts: 0,
        following: 0,
        followers: 0,
        likes: 0
      });
    }
  }

  const fetchUserTweets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log("No token found for tweets");
        setTweets([]);
        return;
      }

      console.log("Fetching user tweets from:", `${API_URL}/api/user/tweets`);
      
      // Fetch user tweets from API
      const response = await fetch(`${API_URL}/api/user/tweets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Tweets response status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Tweets result:", result);
        if (result.success) {
          setTweets(result.tweets || []);
          
          // Set info message if there's one
          if (result.message) {
            setInfoMessage(result.message);
          }
        } else {
          console.error("Tweets API returned error:", result.message);
          setError("Failed to load tweets: " + result.message);
          setTweets([]);
        }
      } else {
        const errorText = await response.text();
        console.error("Tweets API error response:", response.status, response.statusText, errorText);
        setError(`Failed to load tweets: ${response.status} ${response.statusText} - ${errorText}`);
        setTweets([]);
      }
    } catch (error) {
      console.error("Error fetching user tweets:", error);
      setError("Network error while fetching tweets: " + (error as Error).message);
      setTweets([]);
    }
  }

  // Format timestamp for better readability
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-gray-700">Loading profile data...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Using main site header instead of dashboard header */}
      <Header />
      
      {/* Main Content - 85% width with proper top margin to account for fixed header */}
      <div className="w-[85%] mx-auto pt-20">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="ml-3 text-sm font-medium text-red-800">Error</h3>
            </div>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {/* Info Message */}
        {infoMessage && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="ml-3 text-sm font-medium text-blue-800">Information</h3>
            </div>
            <div className="mt-2 text-sm text-blue-700">
              <p>{infoMessage}</p>
            </div>
          </div>
        )}
        
        {/* Profile Header */}
        <div className="relative">
          {/* Banner - Twitter style with a subtle gradient */}
          <div className="h-48 bg-gradient-to-r from-sky-400 to-blue-500 rounded-b-xl"></div>
          
          {/* Profile Info */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="flex justify-between items-start">
              <div className="relative -mt-16">
                {/* Profile image with Twitter-style border */}
                <div className="bg-white p-1 rounded-full">
                  <Avatar className="h-32 w-32 border-4 border-white rounded-full">
                    <AvatarImage 
                      src={userData?.twitterProfileImageUrl || userData?.profileImage || "/placeholder.svg"} 
                      alt={userData?.name || "User"} 
                    />
                    <AvatarFallback className="bg-gray-300 text-2xl text-gray-700 rounded-full">
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <div className="flex space-x-2 mt-4">
                {/* Twitter-style buttons */}
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 h-9">
                  <PenTool className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Post</span>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2 h-9">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="mt-3">
              <h1 className="text-xl font-bold text-gray-900">{userData?.name || "User"}</h1>
              <p className="text-gray-500">@{userData?.twitterUsername || "username"}</p>
              
              <p className="mt-3 text-gray-700">Digital creator | AI enthusiast | Building the future of social media</p>
              
              <div className="flex flex-wrap gap-4 mt-3 text-gray-500">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="h-4 w-4" />
                  <span className="text-blue-500 text-sm">mywebsite.com</span>
                </div>
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-sm">Joined June 2023</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <UserCheck className="h-4 w-4 text-gray-500" />
                  <span className="font-bold text-gray-900">{stats.following.toLocaleString()}</span>
                  <span className="text-gray-500">Following</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="font-bold text-gray-900">{stats.followers.toLocaleString()}</span>
                  <span className="text-gray-500">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs - Twitter style */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === "posts" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === "replies" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("replies")}
          >
            Replies
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === "media" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
          <button 
            className={`flex-1 py-4 text-center font-medium ${activeTab === "likes" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </button>
        </div>
        
        {/* Tweets - Twitter style */}
        <div className="divide-y divide-gray-200">
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <div key={tweet.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage 
                      src={userData?.twitterProfileImageUrl || userData?.profileImage || "/placeholder.svg"} 
                      alt={userData?.name || "User"} 
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-700">
                      {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{userData?.name || "User"}</span>
                      <span className="text-gray-500">@{userData?.twitterUsername || "username"}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500 text-sm">{formatTimestamp(tweet.timestamp)}</span>
                    </div>
                    
                    <p className="mt-1 text-gray-800">{tweet.content}</p>
                    
                    {tweet.image && (
                      <div className="mt-3 rounded-2xl overflow-hidden">
                        <img 
                          src={tweet.image} 
                          alt="Tweet image" 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-3 max-w-md">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{tweet.replies}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-green-500">
                        <Repeat2 className="h-4 w-4" />
                        <span className="text-sm">{tweet.retweets}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{tweet.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-500">
                        <Share className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <button className="text-gray-500 hover:text-blue-500">
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No posts yet</h3>
              <p className="mt-1 text-gray-500">
                {infoMessage ? infoMessage : "When you post tweets, they'll show up here."}
              </p>
              <Button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                <PenTool className="h-4 w-4 mr-2" />
                Create your first post
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}