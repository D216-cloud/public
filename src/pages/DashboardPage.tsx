"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Users,
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Clock,
  MessageSquare,
  BarChart3,
  Plus,
  Eye,
  Edit,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Menu,
  Zap,
  Crown,
  ArrowRight,
  Heart,
  Share2,
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type PostStatus = "published" | "scheduled" | "draft"

interface RecentPost {
  id: number
  content: string
  time: string
  likes: number
  retweets: number
  comments: number
  status: PostStatus
  image: string | null
}

const analyticsData = [
  { name: "Mon", followers: 1200, engagement: 45, posts: 3 },
  { name: "Tue", followers: 1250, engagement: 52, posts: 2 },
  { name: "Wed", followers: 1180, engagement: 38, posts: 4 },
  { name: "Thu", followers: 1320, engagement: 65, posts: 3 },
  { name: "Fri", followers: 1450, engagement: 78, posts: 5 },
  { name: "Sat", followers: 1380, engagement: 55, posts: 2 },
  { name: "Sun", followers: 1520, engagement: 82, posts: 3 },
]

const recentPosts: RecentPost[] = [
  {
    id: 1,
    content: "🚀 Just launched our new AI-powered feature! The future of content creation is here.",
    time: "2 hours ago",
    likes: 145,
    retweets: 32,
    comments: 18,
    status: "published",
    image: null,
  },
  {
    id: 2,
    content: "Monday motivation: Every expert was once a beginner. Keep pushing forward! 💪",
    time: "1 day ago",
    likes: 278,
    retweets: 45,
    comments: 23,
    status: "published",
    image: null,
  },
  {
    id: 3,
    content: "Working on something exciting for next week. Can't wait to share the details! 🔥",
    time: "2 days ago",
    likes: 89,
    retweets: 12,
    comments: 8,
    status: "published",
    image: null,
  },
  {
    id: 4,
    content: "Tips for better engagement: 1) Post consistently 2) Use relevant hashtags 3) Engage with your audience",
    time: "Scheduled for tomorrow",
    likes: 0,
    retweets: 0,
    comments: 0,
    status: "scheduled",
    image: null,
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const getStatusVariant = (status: "published" | "scheduled" | "draft"): "default" | "secondary" | "outline" => {
    switch (status) {
      case "published":
        return "default"
      case "scheduled":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "default"
    }
  }

  const getStatusColors = (status: PostStatus) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200"
      case "draft":
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 pt-16">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 lg:py-8 relative">
        {/* Enhanced Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div 
            className={`
              fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-500 ease-in-out
              ${isAnimating ? 'animate-fade-in-overlay' : ''}
            `}
            onClick={handleMobileMenuToggle}
          />
        )}
        
        {/* Enhanced Mobile Menu Panel */}
        <div 
          className={`
            fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-xl shadow-2xl z-50 transform transition-all duration-500 ease-out lg:hidden
            ${isMobileMenuOpen 
              ? 'translate-x-0 opacity-100 animate-slide-in-right' 
              : 'translate-x-full opacity-0'
            }
            ${isAnimating ? 'animate-menu-slide' : ''}
          `}
        >
          <div className="p-6 h-full flex flex-col">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between mb-8 animate-in slide-in-from-top-1 duration-200">
              <div className="flex items-center space-x-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                  <SlidersHorizontal className="h-5 w-5 text-white" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping-slow" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Dashboard Controls</h2>
                  <p className="text-sm text-gray-500">Filter and search your data</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMobileMenuToggle}
                className="h-10 w-10 p-0 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:rotate-90 group relative overflow-hidden"
              >
                <X className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors duration-200 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur" />
              </Button>
            </div>
            
            {/* Mobile Menu Content */}
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className="animate-in slide-in-from-left-1 duration-200">
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <span>Search</span>
                </label>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
                  <Input
                    placeholder="Search dashboard..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md group-hover:border-blue-200"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-500 transition-all duration-300 pointer-events-none" />
                </div>
              </div>
              
              <div className="animate-in slide-in-from-left-2 duration-300 space-y-3">
                <label className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <span>Time Period</span>
                </label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
                    <SelectItem value="all" className="hover:bg-blue-50 transition-colors duration-200">All Time</SelectItem>
                    <SelectItem value="week" className="hover:bg-blue-50 transition-colors duration-200">This Week</SelectItem>
                    <SelectItem value="month" className="hover:bg-blue-50 transition-colors duration-200">This Month</SelectItem>
                    <SelectItem value="year" className="hover:bg-blue-50 transition-colors duration-200">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="animate-in slide-in-from-left-3 duration-400">
                <Button 
                  className="group relative w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 overflow-hidden"
                  onClick={() => {
                    // Handle generate content
                    handleMobileMenuToggle()
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Generate Content</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Header Section */}
        <div className="flex flex-col space-y-6 mb-8 animate-in slide-in-from-top-1 duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 relative overflow-hidden">
            {/* Header Text */}
            <div className="space-y-3 group relative">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x">
                Dashboard
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium max-w-2xl animate-in fade-in duration-500">
                Welcome back! Here's your Twitter growth overview powered by AI
              </p>
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden lg:flex items-center space-x-4 animate-in slide-in-from-right-1 duration-400">
              <Button 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-3 h-12 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Generate Content</span>
                  <Sparkles className="h-4 w-4 group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Button>
              <Button
                variant="outline"
                className="relative h-12 px-6 border-gray-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl font-semibold group overflow-hidden"
              >
                <Filter className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span>Filters</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Button>
            </div>
            
            {/* Enhanced Mobile Controls */}
            <div className="flex lg:hidden items-center space-x-3 animate-in slide-in-from-right-1 duration-300">
              <Button 
                className="group relative h-12 w-12 p-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-110 rounded-xl overflow-hidden"
                onClick={() => {
                  // Handle generate content
                }}
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Plus className="h-5 w-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMobileMenuToggle}
                className="h-12 w-12 p-0 border-gray-200 hover:bg-gray-50 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-110 rounded-xl group relative overflow-hidden"
              >
                <SlidersHorizontal className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Desktop Search & Filters */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg animate-in slide-in-from-top-2 duration-400">
          <div className="col-span-2">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300" />
              <Input
                placeholder="Search dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-200 rounded-xl text-base bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-500 transition-all duration-300 pointer-events-none" />
            </div>
          </div>
          <div className="flex space-x-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="flex-1 h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
                <SelectItem value="all" className="hover:bg-blue-50 transition-colors duration-200">All Time</SelectItem>
                <SelectItem value="week" className="hover:bg-blue-50 transition-colors duration-200">This Week</SelectItem>
                <SelectItem value="month" className="hover:bg-blue-50 transition-colors duration-200">This Month</SelectItem>
                <SelectItem value="year" className="hover:bg-blue-50 transition-colors duration-200">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40 h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <SelectValue placeholder="All Metrics" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg">
                <SelectItem value="all" className="hover:bg-blue-50 transition-colors duration-200">All Metrics</SelectItem>
                <SelectItem value="followers" className="hover:bg-blue-50 transition-colors duration-200">Followers</SelectItem>
                <SelectItem value="engagement" className="hover:bg-blue-50 transition-colors duration-200">Engagement</SelectItem>
                <SelectItem value="posts" className="hover:bg-blue-50 transition-colors duration-200">Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[
            { title: "Total Followers", value: "1,520", change: "+12.5%", icon: Users, color: "blue", trend: "up" },
            { title: "Engagement Rate", value: "8.2%", change: "+2.1%", icon: TrendingUp, color: "green", trend: "up" },
            { title: "Scheduled Posts", value: "24", change: "Next in 2h", icon: Calendar, color: "orange", trend: "neutral" },
            { title: "AI Credits", value: "156", change: "Resets in 12d", icon: Sparkles, color: "purple", trend: "neutral" },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card 
                key={stat.title}
                className={`
                  group relative overflow-hidden border-0 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-500
                  hover:shadow-xl hover:scale-[1.02] animate-in slide-in-from-bottom-${index + 1} duration-${300 + index * 100}
                  before:absolute before:inset-0 before:bg-gradient-to-r before:from-${stat.color}-500 before:to-${stat.color}-600
                  before:opacity-0 before:blur group-hover:before:opacity-10
                `}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 sm:px-6 pt-4 sm:pt-6 relative z-10">
                  <CardTitle className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2.5 bg-${stat.color}-100 rounded-xl group-hover:bg-${stat.color}-200 transition-all duration-300 transform group-hover:scale-110 shadow-sm`}>
                    <Icon className={`h-4 w-4 text-${stat.color}-600 group-hover:text-${stat.color}-700 transition-colors duration-300`} />
                  </div>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 relative z-10">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-gray-800 transition-colors duration-300">
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-600 flex items-center mt-2 animate-pulse">
                    {stat.trend === "up" && <ArrowUpRight className={`h-3 w-3 mr-1 text-${stat.color}-500 animate-bounce`} />}
                    {stat.trend === "down" && <ArrowUpRight className={`h-3 w-3 mr-1 text-red-500 rotate-180 animate-bounce`} />}
                    <span className={`font-semibold ${stat.trend === "up" ? `text-${stat.color}-600` : stat.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                      {stat.change}
                    </span>
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Growth Analytics Card */}
          <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-2xl hover:shadow-2xl transition-all duration-500 animate-in slide-in-from-left-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="px-6 py-5 bg-gradient-to-r from-blue-50 to-purple-50/30 relative z-10">
              <CardTitle className="text-lg font-semibold flex items-center space-x-3 text-gray-900 group-hover:text-blue-800 transition-colors duration-300">
                <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <TrendingUp className="h-5 w-5 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping-slow" />
                </div>
                <span>Growth Analytics</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Your follower growth and engagement over the last week
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8 pt-4 relative z-10">
              <div className="p-6 bg-gradient-to-br from-blue-50/30 via-white/50 to-purple-50/20 rounded-2xl border border-blue-100/50 shadow-inner">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={analyticsData} className="animate-chart-load">
                    <defs>
                      <linearGradient id="followersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.5} />
                    <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" tickLine={false} />
                    <YAxis fontSize={12} stroke="#94a3b8" tickLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '12px 16px'
                      }}
                      labelStyle={{ fontWeight: '600', color: '#374151' }}
                      itemStyle={{ fontSize: '14px', color: '#6b7280' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="followers"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      strokeLinecap="round"
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6, stroke: "#ffffff" }}
                      activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2, fill: "#ffffff" }}
                      fill="url(#followersGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="engagement"
                      stroke="#a855f7"
                      strokeWidth={3}
                      strokeLinecap="round"
                      dot={{ fill: "#a855f7", strokeWidth: 2, r: 6, stroke: "#ffffff" }}
                      activeDot={{ r: 8, stroke: "#a855f7", strokeWidth: 2, fill: "#ffffff" }}
                      fill="url(#engagementGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Post Performance Card */}
          <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200/50 rounded-2xl hover:shadow-2xl transition-all duration-500 animate-in slide-in-from-right-1">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="px-6 py-5 bg-gradient-to-r from-purple-50 to-blue-50/30 relative z-10">
              <CardTitle className="text-lg font-semibold flex items-center space-x-3 text-gray-900 group-hover:text-purple-800 transition-colors duration-300">
                <div className="relative p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <BarChart3 className="h-5 w-5 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping-slow" />
                </div>
                <span>Post Performance</span>
              </CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Daily post count and engagement metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8 pt-4 relative z-10">
              <div className="p-6 bg-gradient-to-br from-purple-50/30 via-white/50 to-blue-50/20 rounded-2xl border border-purple-100/50 shadow-inner">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={analyticsData} className="animate-chart-load">
                    <defs>
                      <linearGradient id="postsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a855f7" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#a855f7" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeOpacity={0.5} />
                    <XAxis dataKey="name" fontSize={12} stroke="#94a3b8" tickLine={false} />
                    <YAxis fontSize={12} stroke="#94a3b8" tickLine={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '16px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '12px 16px'
                      }}
                      labelStyle={{ fontWeight: '600', color: '#374151' }}
                      itemStyle={{ fontSize: '14px', color: '#6b7280' }}
                    />
                    <Bar 
                      dataKey="posts" 
                      fill="url(#postsGradient)"
                      radius={[8, 8, 0, 0]}
                      className="group/bar hover:opacity-90 transition-opacity duration-300"
                      barSize={24}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Recent Activity Card */}
        <Card className="relative overflow-hidden mb-8 bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 hover:shadow-2xl transition-all duration-500 animate-in slide-in-from-top-3 duration-600">
          <div className="absolute inset-0 bg-gradient-to-r from-green-50/50 via-blue-50/30 to-purple-50/30" />
          <CardHeader className="px-6 py-6 bg-gradient-to-r from-green-50 to-blue-50/30 border-b border-gray-100/50 relative z-10">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-3">
              <div className="relative p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <MessageSquare className="h-5 w-5 text-white relative z-10" />
                <div className="absolute -inset-2 bg-white/20 rounded-xl animate-ping-slow" />
              </div>
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-2">
              Your latest posts and their performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6 relative z-10">
            <div className="space-y-4">
              {recentPosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`
                    group relative p-6 border border-gray-200/50 rounded-2xl hover:shadow-lg transition-all duration-500
                    bg-gradient-to-r from-white via-gray-50/50 to-blue-50/30 hover:from-blue-50/30 hover:to-purple-50/30
                    hover:border-blue-200/50 hover:scale-[1.01] animate-in slide-in-from-bottom-${index + 1} duration-${400 + index * 100}
                    before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/5 before:to-purple-500/5
                    before:rounded-2xl before:opacity-0 before:blur group-hover:before:opacity-100 transition-all duration-500
                  `}
                >
                  <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 space-y-4">
                        <div className="group/post p-4 bg-white/80 rounded-xl border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                          <p className="text-base text-gray-800 leading-relaxed break-words">
                            {post.content}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 animate-in fade-in duration-300">
                          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-gray-200/50">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-700">{post.time}</span>
                          </div>
                          {post.status === "published" && (
                            <>
                              <div className="group/stats flex items-center space-x-2 bg-gradient-to-r from-red-50/80 to-pink-50/80 text-red-600 px-4 py-2 rounded-full text-sm shadow-sm border border-red-200/50 backdrop-blur-sm">
                                <Heart className="h-4 w-4 group-hover:fill-red-500 group-hover:text-red-600 transition-all duration-300" />
                                <span className="font-semibold">{post.likes} likes</span>
                              </div>
                              <div className="group/stats flex items-center space-x-2 bg-gradient-to-r from-green-50/80 to-emerald-50/80 text-green-600 px-4 py-2 rounded-full text-sm shadow-sm border border-green-200/50 backdrop-blur-sm">
                                <Share2 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                                <span className="font-semibold">{post.retweets} retweets</span>
                              </div>
                              <div className="group/stats flex items-center space-x-2 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 text-blue-600 px-4 py-2 rounded-full text-sm shadow-sm border border-blue-200/50 backdrop-blur-sm">
                                <MessageSquare className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                <span className="font-semibold">{post.comments} comments</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-end space-x-2 lg:ml-6 flex-shrink-0">
                        <Badge 
                          variant={getStatusVariant(post.status)} 
                          className={`
                            ${getStatusColors(post.status)} 
                            font-semibold px-4 py-2 rounded-full shadow-sm
                            transform transition-all duration-300 hover:scale-105
                            ${post.status === "published" ? "animate-pulse" : ""}
                          `}
                        >
                          {post.status === "published" ? "Published" : "Scheduled"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group relative h-10 w-10 p-0 hover:bg-blue-100/80 hover:text-blue-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md transform hover:scale-110 overflow-hidden"
                        >
                          <Eye className="h-4 w-4 relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="group relative h-10 w-10 p-0 hover:bg-green-100/80 hover:text-green-600 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md transform hover:scale-110 overflow-hidden"
                        >
                          <Edit className="h-4 w-4 relative z-10" />
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 animate-in slide-in-from-bottom-2 duration-700">
          {[
            { label: "Generate New Content", icon: Sparkles, color: "from-blue-600 to-indigo-600" },
            { label: "Schedule Post", icon: Calendar, color: "from-gray-100 to-gray-200", variant: "outline" },
            { label: "View Analytics", icon: BarChart3, color: "from-gray-100 to-gray-200", variant: "outline" },
          ].map((action, index) => {
            const Icon = action.icon
            return (
              <Button 
                key={action.label}
                variant={action.variant as "default" | "secondary" | "outline" | "link" | "destructive" | "ghost" | undefined}
                className={`
                  group relative h-14 flex items-center justify-center space-x-3
                  ${action.variant === "outline" 
                    ? `bg-white/90 backdrop-blur-sm border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-50`
                    : `bg-gradient-to-r ${action.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl font-bold`
                  }
                  overflow-hidden animate-in slide-in-from-left-${index + 1} duration-${400 + index * 100}
                `}
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${action.variant === "outline" ? "text-gray-500 group-hover:text-gray-700" : "relative z-10"}`} />
                  <span>{action.label}</span>
                  {action.variant !== "outline" && (
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  )}
                </span>
                {action.variant !== "outline" && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                )}
              </Button>
            )
          })}
        </div>
      </main>
    </div>
  )
}