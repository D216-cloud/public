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
  TrendingUp as TrendingUpIcon,
  BarChart3 as BarChart3Icon,
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
  const [viewMode, setViewMode] = useState<"overview" | "analytics" | "activity">("overview")

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "analytics":
        return <TrendingUpIcon className="h-4 w-4" />
      case "charts":
        return <BarChart3Icon className="h-4 w-4" />
      default:
        return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 lg:py-8 relative">
        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu Panel */}
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-gray-900">Filter & Search</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="h-10 w-10 p-0 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Search */}
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Dashboard</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search dashboard..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Mobile Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full h-12 border-gray-200 rounded-xl">
                    <SelectValue placeholder="All Time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Metrics Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full h-12 border-gray-200 rounded-xl">
                    <SelectValue placeholder="All Metrics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Metrics</SelectItem>
                    <SelectItem value="followers">Followers</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="posts">Posts</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mobile View Mode Toggle */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">View Mode</label>
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <Button
                    variant={viewMode === "overview" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("overview")}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === "overview"
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant={viewMode === "analytics" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("analytics")}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === "analytics"
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <TrendingUpIcon className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant={viewMode === "activity" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("activity")}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === "activity"
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Activity
                  </Button>
                </div>
              </div>

              {/* Mobile Generate Button */}
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6 mb-8">
          {/* Header with Mobile Menu Button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                Welcome back! Here's your Twitter growth overview powered by AI
              </p>
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <Button
                  variant={viewMode === "overview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                  className={`h-10 px-6 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === "overview"
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={viewMode === "analytics" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("analytics")}
                  className={`h-10 px-6 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === "analytics"
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <TrendingUpIcon className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant={viewMode === "activity" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("activity")}
                  className={`h-10 px-6 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === "activity"
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Activity
                </Button>
              </div>
              <Button className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Plus className="h-4 w-4 mr-2" />
                Generate Content
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "overview" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                  className={`h-10 px-4 rounded-lg transition-all ${
                    viewMode === "overview" ? "bg-blue-600 text-white" : "text-gray-600"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "analytics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("analytics")}
                  className={`h-10 px-4 rounded-lg transition-all ${
                    viewMode === "analytics" ? "bg-blue-600 text-white" : "text-gray-600"
                  }`}
                >
                  <TrendingUpIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "activity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("activity")}
                  className={`h-10 px-4 rounded-lg transition-all ${
                    viewMode === "activity" ? "bg-blue-600 text-white" : "text-gray-600"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button className="h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 rounded-lg font-medium">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="h-10 w-10 p-0 border-gray-200 hover:bg-gray-50"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Search & Filters */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-6 mb-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-200 rounded-xl text-base bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="All Metrics" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewMode === "overview" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <CardTitle className="text-lg flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Overview Stats</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">Key metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-4">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/20 rounded-2xl border-2 border-blue-100 shadow-inner">
                  <div className="space-y-5">
                    <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-100/70 rounded-2xl border border-blue-200/70 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-6 h-6 bg-blue-500 rounded-full shadow-lg flex items-center justify-center ring-4 ring-blue-100">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg">Total Followers</span>
                          <p className="text-sm text-blue-700 font-medium mt-1">Growth overview</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-600 text-white px-4 py-2.5 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                        1,520
                      </Badge>
                    </div>
                    <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-green-50 via-green-50 to-green-100/70 rounded-2xl border border-green-200/70 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-6 h-6 bg-green-500 rounded-full shadow-lg flex items-center justify-center ring-4 ring-green-100">
                            <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 text-lg">Engagement Rate</span>
                          <p className="text-sm text-green-700 font-medium mt-1">Interaction metrics</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white px-4 py-2.5 rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
                        8.2%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardHeader className="px-6 py-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Quick Overview
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-2">
                  Your current dashboard summary
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <BarChart3 className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-3">Welcome to your dashboard</h3>
                    <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                      Explore your Twitter growth metrics, recent activity, and AI-powered content generation tools.
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                      <Plus className="h-5 w-5 mr-2" />
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : viewMode === "analytics" ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
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
        ) : (
          <div className="space-y-6">
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Recent Activity</span>
                  </span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {recentPosts.length} posts
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">Your latest posts and their performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group p-4 border rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50 hover:from-blue-50/30 hover:to-purple-50/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm">
                              <BarChart3 className="h-4 w-4" />
                              <Badge variant="secondary" className="text-xs font-medium">
                                Activity
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-white rounded-full px-3 py-1 shadow-sm">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">{post.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed bg-white/60 p-3 rounded-lg">
                            {post.content}
                          </p>
                          {post.status === "published" && (
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <div className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-full">
                                <Heart className="h-3 w-3" />
                                <span className="font-medium">{post.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full">
                                <Share2 className="h-3 w-3" />
                                <span className="font-medium">{post.retweets}</span>
                              </div>
                              <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                                <MessageSquare className="h-3 w-3" />
                                <span className="font-medium">{post.comments}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end space-x-2 sm:ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-green-100 hover:text-green-600 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Writing Assistant */}
            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-indigo-50 to-purple-50">
                <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    <span>AI Writing Assistant</span>
                  </span>
                  <Badge variant="default" className="bg-indigo-100 text-indigo-700">
                    Generate
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  Generate engaging content for your next tweet with AI-powered suggestions
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  <div className="relative group">
                    <textarea
                      placeholder="What would you like to write about today?"
                      className="w-full min-h-[120px] p-4 border border-gray-200 rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none"
                    />
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-focus-within:border-indigo-500 transition-all duration-300 pointer-events-none" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {["Tech Tips", "Motivation", "Industry News", "Personal Story"].map((topic) => (
                      <Button
                        key={topic}
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all duration-200 rounded-full"
                      >
                        {topic}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-col space-y-4">
                    <Button className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold h-12 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                      <span className="relative z-10 flex items-center space-x-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Generate with AI</span>
                        <Zap className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-indigo-700 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    </Button>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50 h-12 rounded-xl transition-all duration-200">
                      <Edit className="h-4 w-4 mr-2" />
                      Write Manually
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}