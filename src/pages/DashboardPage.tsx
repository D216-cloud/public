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
  Target,
  Lightbulb,
  Rocket,
  Star,
  CheckCircle,
  AlertCircle,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  PenTool
} from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from "recharts"
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

const performanceData = [
  { name: "Engagement", value: 78 },
  { name: "Reach", value: 65 },
  { name: "Impressions", value: 82 },
  { name: "Profile Visits", value: 45 },
]

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981"]

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

const quickActions = [
  { title: "Create Post", icon: <PenTool className="h-5 w-5" />, color: "from-blue-500 to-blue-600" },
  { title: "Schedule Post", icon: <Calendar className="h-5 w-5" />, color: "from-purple-500 to-purple-600" },
  { title: "Analyze Performance", icon: <BarChart3 className="h-5 w-5" />, color: "from-green-500 to-green-600" },
  { title: "AI Suggestions", icon: <Sparkles className="h-5 w-5" />, color: "from-pink-500 to-pink-600" },
]

const metrics = [
  { title: "Total Followers", value: "1,520", change: "+12.5%", icon: <Users className="h-5 w-5" />, color: "text-blue-600", bg: "bg-blue-50" },
  { title: "Engagement Rate", value: "8.2%", change: "+3.2%", icon: <Activity className="h-5 w-5" />, color: "text-green-600", bg: "bg-green-50" },
  { title: "Posts This Week", value: "17", change: "+5", icon: <MessageSquare className="h-5 w-5" />, color: "text-purple-600", bg: "bg-purple-50" },
  { title: "Impressions", value: "42.5K", change: "+18.3%", icon: <Globe className="h-5 w-5" />, color: "text-pink-600", bg: "bg-pink-50" },
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 pt-16">
      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl">
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
              <p className="text-base sm:text-lg text-slate-600 font-medium">
                Welcome back! Here's your Twitter growth overview powered by AI
              </p>
            </div>

            {/* Desktop Controls */}
            <div className="hidden lg:flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center bg-white/90 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl p-2">
                <Button
                  variant={viewMode === "overview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("overview")}
                  className={`h-12 px-6 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "overview"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Overview
                </Button>
                <Button
                  variant={viewMode === "analytics" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("analytics")}
                  className={`h-12 px-6 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "analytics"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <TrendingUpIcon className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
                <Button
                  variant={viewMode === "activity" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("activity")}
                  className={`h-12 px-6 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "activity"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Activity
                </Button>
              </div>
              <Button className="h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <Plus className="h-5 w-5 mr-2" />
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
                  className={`h-12 px-4 rounded-xl transition-all duration-300 ${
                    viewMode === "overview" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "analytics" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("analytics")}
                  className={`h-12 px-4 rounded-xl transition-all duration-300 ${
                    viewMode === "analytics" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <TrendingUpIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "activity" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("activity")}
                  className={`h-12 px-4 rounded-xl transition-all duration-300 ${
                    viewMode === "activity" ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "text-slate-600 border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 rounded-xl font-medium shadow-lg">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="h-12 w-12 p-0 border-slate-300 hover:bg-slate-50 rounded-xl"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Search & Filters */}
        <div className="hidden lg:flex flex-col lg:flex-row gap-6 mb-8 p-6 bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search dashboard..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 border-slate-200 rounded-xl text-base bg-white/80 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-14 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 h-14 border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
                <SelectValue placeholder="All Metrics" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all">All Metrics</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="engagement">Engagement</SelectItem>
                <SelectItem value="posts">Posts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewMode === "overview" ? (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {metrics.map((metric, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="pb-3 relative z-10 px-6 pt-6">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${metric.bg} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <div className="text-white">
                          {metric.icon}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 rounded-full px-3 py-1">
                        {metric.change}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10 px-6 pb-6">
                    <p className="text-sm text-slate-600 font-medium">{metric.title}</p>
                    <h3 className={`text-2xl font-bold ${metric.color} mt-1`}>{metric.value}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {quickActions.map((action, index) => (
                <Card key={index} className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20 cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  <CardContent className="p-8 relative z-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <div className={`p-4 rounded-2xl bg-gradient-to-br ${action.color} shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                        <div className="text-white">
                          {action.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-slate-800 text-lg">{action.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <span>Performance Metrics</span>
                  </CardTitle>
                  <CardDescription className="text-sm text-gray-600 mt-1">
                    Key performance indicators for your content
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-8 pt-4 relative z-10">
                  <div className="p-6 bg-gradient-to-br from-purple-50/30 via-white/50 to-blue-50/20 rounded-2xl border border-purple-100/50 shadow-inner">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={performanceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '16px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            padding: '12px 16px'
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Recent Activity
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Your latest posts and their performance metrics
                    </CardDescription>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200 rounded-full px-4 py-2 font-medium">
                    {recentPosts.length} posts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 py-8">
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group p-6 border border-slate-200/50 rounded-2xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-slate-50/30 hover:from-blue-50/50 hover:to-purple-50/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200/50">
                              <BarChart3 className="h-4 w-4 text-blue-600" />
                              <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                                Activity
                              </Badge>
                            </div>
                            <div className={`flex items-center space-x-2 text-xs font-medium bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200/50 ${getStatusColors(post.status)}`}>
                              <Clock className="h-3 w-3" />
                              <span>{post.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-slate-200/30 shadow-sm">
                            {post.content}
                          </p>
                          {post.status === "published" && (
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 px-4 py-2 rounded-full border border-red-200/50 shadow-sm">
                                <Heart className="h-4 w-4" />
                                <span className="font-semibold">{post.likes}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 px-4 py-2 rounded-full border border-green-200/50 shadow-sm">
                                <Share2 className="h-4 w-4" />
                                <span className="font-semibold">{post.retweets}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 px-4 py-2 rounded-full border border-blue-200/50 shadow-sm">
                                <MessageSquare className="h-4 w-4" />
                                <span className="font-semibold">{post.comments}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end space-x-3 sm:ml-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-12 w-12 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 rounded-xl border border-slate-200/50"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-12 w-12 p-0 hover:bg-green-100 hover:text-green-600 transition-all duration-300 rounded-xl border border-slate-200/50"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : viewMode === "analytics" ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Growth Analytics
                      </CardTitle>
                      <CardDescription className="text-base text-slate-600 mt-1">
                        Your follower growth and engagement over the last week
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 sm:px-8 pb-8 pt-4">
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

              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-purple-50/90 via-pink-50/80 to-orange-50/70 backdrop-blur-xl border-b border-white/30">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                        Post Performance
                      </CardTitle>
                      <CardDescription className="text-base text-slate-600 mt-1">
                        Daily post count and engagement metrics
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-6 sm:px-8 pb-8 pt-4">
                  <div className="p-6 bg-gradient-to-br from-purple-50/30 via-white/50 to-pink-50/20 rounded-2xl border border-purple-100/50 shadow-inner">
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

            {/* Additional Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Engagement Rate</h3>
                      <p className="text-2xl font-bold text-green-600 mt-1">8.2%</p>
                      <p className="text-sm text-slate-600">+3.2% from last week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Reach</h3>
                      <p className="text-2xl font-bold text-blue-600 mt-1">42.5K</p>
                      <p className="text-sm text-slate-600">+18.3% from last week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl shadow-lg">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Growth</h3>
                      <p className="text-2xl font-bold text-purple-600 mt-1">+245</p>
                      <p className="text-sm text-slate-600">New followers this week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-green-50/90 via-blue-50/80 to-purple-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl shadow-lg">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Activity Feed
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Real-time updates on your content performance and audience interactions
                    </CardDescription>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-blue-100 text-green-700 border-green-200 rounded-full px-4 py-2 font-medium">
                    {recentPosts.length} recent activities
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-6 sm:px-8 py-8">
                <div className="space-y-6">
                  {recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group p-6 border border-slate-200/50 rounded-2xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-slate-50/30 hover:from-green-50/50 hover:to-blue-50/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200/50">
                              <Activity className="h-4 w-4 text-green-600" />
                              <Badge variant="secondary" className="text-xs font-medium bg-gradient-to-r from-green-100 to-blue-100 text-green-700">
                                Activity
                              </Badge>
                            </div>
                            <div className={`flex items-center space-x-2 text-xs font-medium bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200/50 ${getStatusColors(post.status)}`}>
                              <Clock className="h-3 w-3" />
                              <span>{post.time}</span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed bg-white/80 p-4 rounded-xl border border-slate-200/30 shadow-sm">
                            {post.content}
                          </p>
                          {post.status === "published" && (
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-600 px-4 py-2 rounded-full border border-red-200/50 shadow-sm">
                                <Heart className="h-4 w-4" />
                                <span className="font-semibold">{post.likes}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 px-4 py-2 rounded-full border border-green-200/50 shadow-sm">
                                <Share2 className="h-4 w-4" />
                                <span className="font-semibold">{post.retweets}</span>
                              </div>
                              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 px-4 py-2 rounded-full border border-blue-200/50 shadow-sm">
                                <MessageSquare className="h-4 w-4" />
                                <span className="font-semibold">{post.comments}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-end space-x-3 sm:ml-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-12 w-12 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 rounded-xl border border-slate-200/50"
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-12 w-12 p-0 hover:bg-green-100 hover:text-green-600 transition-all duration-300 rounded-xl border border-slate-200/50"
                          >
                            <Edit className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Activity Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg">
                      <Lightbulb className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Content Insights</h3>
                      <p className="text-sm text-slate-600 mt-1">AI-powered recommendations for better engagement</p>
                      <Button variant="outline" size="sm" className="mt-3 h-9 px-4 rounded-lg border-slate-300 hover:bg-slate-50 transition-all duration-300">
                        View Insights
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg">
                      <Rocket className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">Performance Boost</h3>
                      <p className="text-sm text-slate-600 mt-1">Optimize your posting schedule for maximum reach</p>
                      <Button variant="outline" size="sm" className="mt-3 h-9 px-4 rounded-lg border-slate-300 hover:bg-slate-50 transition-all duration-300">
                        Optimize Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
