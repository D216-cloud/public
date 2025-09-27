"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  Clock,
  Edit,
  Trash2,
  Plus,
  Twitter,
  ImageIcon,
  Video,
  BarChart3,
  CalendarIcon,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Menu,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const scheduledPosts = [
  {
    id: 1,
    content: "🚀 Exciting news coming tomorrow! Stay tuned for our biggest announcement yet. #Innovation #TechNews",
    scheduledTime: "2024-01-15T10:00:00",
    type: "text",
    status: "scheduled",
    engagement: { likes: 0, retweets: 0, comments: 0 },
  },
  {
    id: 2,
    content:
      "Monday motivation: Success is not final, failure is not fatal. It's the courage to continue that counts. 💪",
    scheduledTime: "2024-01-15T14:30:00",
    type: "text",
    status: "scheduled",
    engagement: { likes: 0, retweets: 0, comments: 0 },
  },
  {
    id: 3,
    content: "Check out our latest product demo! Link in bio 👆",
    scheduledTime: "2024-01-16T09:15:00",
    type: "image",
    status: "scheduled",
    engagement: { likes: 0, retweets: 0, comments: 0 },
  },
  {
    id: 4,
    content: "Behind the scenes: How we built our AI-powered content generator. Thread 🧵",
    scheduledTime: "2024-01-16T16:45:00",
    type: "thread",
    status: "scheduled",
    engagement: { likes: 0, retweets: 0, comments: 0 },
  },
  {
    id: 5,
    content: "Weekly recap: 5 key insights from this week's industry trends. What caught your attention?",
    scheduledTime: "2024-01-17T11:20:00",
    type: "text",
    status: "scheduled",
    engagement: { likes: 0, retweets: 0, comments: 0 },
  },
]

const publishedPosts = [
  {
    id: 6,
    content: "Just shipped a major update! Our AI now generates 40% more engaging content. Try it out! 🎉",
    publishedTime: "2024-01-14T15:30:00",
    type: "text",
    status: "published",
    engagement: { likes: 234, retweets: 45, comments: 28 },
  },
  {
    id: 7,
    content: "Friday feeling: When your code works on the first try 😎 #DevLife #Programming",
    publishedTime: "2024-01-12T17:00:00",
    type: "text",
    status: "published",
    engagement: { likes: 156, retweets: 32, comments: 19 },
  },
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledTime)
      return postDate.toDateString() === date.toDateString()
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "thread":
        return <Twitter className="h-4 w-4" />
      default:
        return <Twitter className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-28">
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Search Posts</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-xl"
                  />
                </div>
              </div>
              
              {/* Mobile Filters */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Post Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full h-12 border-gray-200 rounded-xl">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Post Type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full h-12 border-gray-200 rounded-xl">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="thread">Thread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Mobile View Mode Toggle */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">View Mode</label>
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <Button
                    variant={viewMode === "calendar" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("calendar")}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === "calendar"
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`flex-1 h-10 rounded-lg font-medium transition-all duration-200 ${
                      viewMode === "list"
                        ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
              
              {/* Mobile Schedule Button */}
              <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-6 mb-8">
          {/* Header with Mobile Menu Button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Content Calendar
              </h1>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                Manage and schedule your Twitter content with AI precision
              </p>
            </div>
            
            {/* Desktop Controls */}
            <div className="hidden lg:flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className={`h-10 px-6 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === "calendar"
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Calendar
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-10 px-6 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-md hover:bg-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
              <Button className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Post
              </Button>
            </div>
            
            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "calendar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className={`h-10 px-4 rounded-lg transition-all ${
                    viewMode === "calendar" ? "bg-blue-600 text-white" : "text-gray-600"
                  }`}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`h-10 px-4 rounded-lg transition-all ${
                    viewMode === "list" ? "bg-blue-600 text-white" : "text-gray-600"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
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
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 border-gray-200 rounded-xl text-base bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-40 h-12 border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="thread">Thread</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <Card className="xl:col-span-1 bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-5 bg-gradient-to-r from-gray-50 to-blue-50/30">
                <CardTitle className="text-lg flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <span>Calendar</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">Select a date to view scheduled posts</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-8 pt-4">
                <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-50/30 via-white to-blue-50/20 rounded-2xl border-2 border-blue-100 shadow-inner">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="w-full mx-auto [&_.rdp-day]:w-8 [&_.rdp-day]:h-8 sm:[&_.rdp-day]:w-10 sm:[&_.rdp-day]:h-10 [&_.rdp-day]:text-sm [&_.rdp-day]:font-medium [&_.rdp-day]:rounded-xl [&_.rdp-day]:transition-all [&_.rdp-day]:duration-200 [&_.rdp-day:hover]:bg-blue-50 [&_.rdp-day:hover]:text-blue-600 [&_.rdp-day:hover]:scale-105 [&_.rdp-day_selected]:bg-blue-600 [&_.rdp-day_selected]:text-white [&_.rdp-day_selected]:shadow-lg [&_.rdp-day_selected:hover]:bg-blue-700 [&_.rdp-day_today]:bg-blue-100 [&_.rdp-day_today]:text-blue-700 [&_.rdp-day_today]:font-bold [&_.rdp-nav_button]:h-8 [&_.rdp-nav_button]:w-8 sm:[&_.rdp-nav_button]:h-10 sm:[&_.rdp-nav_button]:w-10 [&_.rdp-nav_button]:rounded-xl [&_.rdp-nav_button]:hover:bg-blue-50 [&_.rdp-caption]:text-base sm:[&_.rdp-caption]:text-lg [&_.rdp-caption]:font-bold [&_.rdp-caption]:text-gray-900 [&_.rdp-table]:w-full [&_.rdp-table]:table-fixed [&_.rdp-head_cell]:text-muted-foreground [&_.rdp-head_cell]:rounded-md [&_.rdp-head_cell]:flex [&_.rdp-head_cell]:items-center [&_.rdp-head_cell]:justify-center [&_.rdp-head_cell]:font-medium [&_.rdp-head_cell]:text-[0.7rem] sm:[&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:select-none [&_.rdp-head_cell]:py-2"
                  />
                </div>
                <div className="mt-8 space-y-5">
                  <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 via-blue-50 to-blue-100/70 rounded-2xl border border-blue-200/70 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-6 h-6 bg-blue-500 rounded-full shadow-lg flex items-center justify-center ring-4 ring-blue-100">
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 text-lg">Scheduled Posts</span>
                        <p className="text-sm text-blue-700 font-medium mt-1">Ready to publish automatically</p>
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white px-4 py-2.5 rounded-full font-bold text-lg shadow-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105">
                      {scheduledPosts.length}
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
                        <span className="font-bold text-gray-900 text-lg">Published Posts</span>
                        <p className="text-sm text-green-700 font-medium mt-1">Live and engaging audience</p>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white px-4 py-2.5 rounded-full font-bold text-lg shadow-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105">
                      {publishedPosts.length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="xl:col-span-2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <CardHeader className="px-6 py-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Posts for{" "}
                  {selectedDate?.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-2">
                  {selectedDate && getPostsForDate(selectedDate).length} scheduled posts
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="space-y-4">
                  {selectedDate && getPostsForDate(selectedDate).length > 0 ? (
                    <div className="space-y-4">
                      {getPostsForDate(selectedDate).map((post) => (
                        <div
                          key={post.id}
                          className="group p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white via-gray-50/30 to-white hover:from-blue-50/50 hover:to-purple-50/50 hover:border-blue-200"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-4 lg:space-y-0">
                            <div className="flex-1 space-y-4">
                              <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                                  {getTypeIcon(post.type)}
                                  <Badge variant="secondary" className="text-xs font-semibold bg-blue-100 text-blue-700">
                                    {post.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
                                  <Clock className="h-4 w-4" />
                                  <span className="font-medium">{formatTime(post.scheduledTime)}</span>
                                </div>
                              </div>
                              <p className="text-base text-gray-800 leading-relaxed bg-white/80 p-4 rounded-xl border border-gray-100 shadow-sm">
                                {post.content}
                              </p>
                            </div>
                            <div className="flex items-center justify-end space-x-2 lg:ml-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 rounded-xl"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 hover:bg-green-100 hover:text-green-600 transition-all duration-200 rounded-xl"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-600 transition-all duration-200 rounded-xl"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <CalendarIcon className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-3">No posts scheduled</h3>
                      <p className="text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                        Create engaging content for {selectedDate?.toLocaleDateString("en-US", { 
                          month: "long", 
                          day: "numeric" 
                        })} to keep your audience engaged and grow your following.
                      </p>
                      <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
                        <Plus className="h-5 w-5 mr-2" />
                        Schedule Your First Post
                      </Button>
                    </div>
                  )}
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
                    <span>Scheduled Posts</span>
                  </span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {scheduledPosts.length} pending
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">Posts waiting to be published automatically</CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  {scheduledPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group p-4 border rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50 hover:from-blue-50/30 hover:to-purple-50/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm">
                              {getTypeIcon(post.type)}
                              <Badge variant="secondary" className="text-xs font-medium">
                                {post.type}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-white rounded-full px-3 py-1 shadow-sm">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">
                                {formatDate(post.scheduledTime)} at {formatTime(post.scheduledTime)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed bg-white/60 p-3 rounded-lg">
                            {post.content}
                          </p>
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
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 hover:bg-red-100 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-green-50 to-blue-50">
                <CardTitle className="text-lg sm:text-xl flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span>Recently Published</span>
                  </span>
                  <Badge variant="default" className="bg-green-100 text-green-700">
                    {publishedPosts.length} published
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">
                  Posts that have been published with performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <div className="space-y-4">
                  {publishedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="group p-4 border rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-gray-50/50 hover:from-green-50/30 hover:to-blue-50/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-sm">
                              {getTypeIcon(post.type)}
                              <Badge variant="default" className="text-xs bg-green-100 text-green-700">
                                Published
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-white rounded-full px-3 py-1 shadow-sm">
                              <Clock className="h-3 w-3" />
                              <span className="font-medium">
                                {formatDate(post.publishedTime)} at {formatTime(post.publishedTime)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed bg-white/60 p-3 rounded-lg">
                            {post.content}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs">
                            <div className="flex items-center space-x-1 bg-red-50 text-red-600 px-3 py-1 rounded-full">
                              <Heart className="h-3 w-3" />
                              <span className="font-medium">{post.engagement.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1 bg-green-50 text-green-600 px-3 py-1 rounded-full">
                              <Repeat2 className="h-3 w-3" />
                              <span className="font-medium">{post.engagement.retweets}</span>
                            </div>
                            <div className="flex items-center space-x-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                              <MessageCircle className="h-3 w-3" />
                              <span className="font-medium">{post.engagement.comments}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="self-end sm:self-start h-9 w-9 p-0 sm:ml-4 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                        >
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
