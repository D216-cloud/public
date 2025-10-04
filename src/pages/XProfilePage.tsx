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
import { DashboardHeader } from "@/components/dashboard-header"

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
    likes: 0,
    description: ""
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
          likes: 0,
          description: ""
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
            likes: result.likes || 0,
            description: result.description || ""
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
            likes: 0,
            description: ""
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
          likes: 0,
          description: ""
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
        likes: 0,
        description: ""
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

  const getMockTweets = (): Tweet[] => {
    return [
      {
        id: "1",
        content: "Just launched my new project! Excited to share it with the world. #Tech #Innovation",
        timestamp: "2023-06-15T10:30:00Z",
        likes: 42,
        retweets: 12,
        replies: 5,
        image: "/placeholder-image.jpg"
      },
      {
        id: "2",
        content: "Working on something amazing. Can't wait to show you all! #Development #Coding",
        timestamp: "2023-06-14T15:45:00Z",
        likes: 28,
        retweets: 7,
        replies: 3
      },
      {
        id: "3",
        content: "The future of social media is here. Join me on this journey! #Future #SocialMedia",
        timestamp: "2023-06-13T09:15:00Z",
        likes: 156,
        retweets: 43,
        replies: 12
      },
      {
        id: "4",
        content: "AI is transforming how we create content. Here's a sneak peek at our latest tool! #AI #ContentCreation",
        timestamp: "2023-06-12T14:20:00Z",
        likes: 89,
        retweets: 24,
        replies: 8,
        image: "/placeholder-image-2.jpg"
      }
    ]
  }

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
      {/* Header */}
      <DashboardHeader />
      
      {/* Main Content - 85% width */}
      <div className="w-[85%] mx-auto">
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
          {/* Banner */}
          <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 rounded-b-xl"></div>
          
          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex justify-between items-start">
              <div className="relative -mt-16">
                <Avatar className="h-36 w-36 border-4 border-white rounded-full shadow-xl">
                  <AvatarImage 
                    src={userData?.twitterProfileImageUrl || userData?.profileImage || "/placeholder.svg"} 
                    alt={userData?.name || "User"} 
                  />
                  <AvatarFallback className="bg-gray-300 text-2xl text-gray-700 rounded-full">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex space-x-3 mt-4">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2">
                  <PenTool className="h-4 w-4 mr-2" />
                  Create Post
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full px-4 py-2">
                  Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <h1 className="text-2xl font-bold text-gray-900">{userData?.name || "User"}</h1>
              <p className="text-gray-500 text-lg">@{userData?.twitterUsername || "username"}</p>
              
              {/* User Bio/Description */}
              {stats.description ? (
                <p className="mt-3 text-gray-700 text-lg">{stats.description}</p>
              ) : (
                <p className="mt-3 text-gray-700 text-lg">Digital creator | AI enthusiast | Building the future of social media</p>
              )}
              
              <div className="flex flex-wrap gap-6 mt-4 text-gray-500">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  <span className="text-blue-500 text-lg">mywebsite.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-lg">Joined June 2023</span>
                </div>
              </div>
              
              <div className="flex gap-8 mt-6">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-gray-500" />
                  <div>
                    <span className="font-bold text-gray-900 text-xl">{stats.following.toLocaleString()}</span>
                    <span className="text-gray-500 text-lg block">Following</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <span className="font-bold text-gray-900 text-xl">{stats.followers.toLocaleString()}</span>
                    <span className="text-gray-500 text-lg block">Followers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Bar */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-around">
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{stats.posts.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Posts</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{stats.following.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{stats.followers.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-900 text-xl">{stats.likes.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Likes</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          <button 
            className={`flex-1 py-5 text-center font-semibold text-lg ${activeTab === "posts" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button 
            className={`flex-1 py-5 text-center font-semibold text-lg ${activeTab === "replies" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("replies")}
          >
            Replies
          </button>
          <button 
            className={`flex-1 py-5 text-center font-semibold text-lg ${activeTab === "media" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
          <button 
            className={`flex-1 py-5 text-center font-semibold text-lg ${activeTab === "likes" ? "text-blue-500 border-b-4 border-blue-500" : "text-gray-500 hover:bg-gray-100"}`}
            onClick={() => setActiveTab("likes")}
          >
            Likes
          </button>
        </div>
        
        {/* Tweets */}
        <div className="divide-y divide-gray-200">
          {tweets.length > 0 ? (
            tweets.map((tweet) => (
              <div key={tweet.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
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
                      <span className="font-bold text-gray-900 text-lg">{userData?.name || "User"}</span>
                      <span className="text-gray-500">@{userData?.twitterUsername || "username"}</span>
                      <span className="text-gray-500">·</span>
                      <span className="text-gray-500">2h</span>
                    </div>
                    
                    <p className="mt-2 text-gray-800 text-lg">{tweet.content}</p>
                    
                    {tweet.image && (
                      <div className="mt-4 rounded-2xl overflow-hidden">
                        <img 
                          src={tweet.image} 
                          alt="Tweet image" 
                          className="w-full h-80 object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-6 max-w-lg">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-lg">{tweet.replies}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-green-500">
                        <Repeat2 className="h-5 w-5" />
                        <span className="text-lg">{tweet.retweets}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-red-500">
                        <Heart className="h-5 w-5" />
                        <span className="text-lg">{tweet.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500">
                        <Share className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <button className="text-gray-500 hover:text-blue-500">
                    <MoreHorizontal className="h-6 w-6" />
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