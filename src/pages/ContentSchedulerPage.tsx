"use client"

import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Calendar, 
  Clock, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  BarChart3,
  AlertCircle,
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  List,
  User,
  MoreHorizontal,
  ArrowLeft,
  Settings,
  Zap,
  TrendingUp,
  CheckCircle,
  XCircle
} from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { DashboardHeader } from "@/components/dashboard-header"

interface ScheduledPost {
  id: string;
  content: string;
  date: string;
  time: string;
  imageUrl?: string;
  status: "scheduled" | "posted" | "failed";
}

export default function ContentSchedulerPage() {
  const [topic, setTopic] = useState("")
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [newPost, setNewPost] = useState({
    content: "",
    date: "",
    time: "",
    imageUrl: ""
  })
  const [isSchedulerActive, setIsSchedulerActive] = useState(false)
  const [stats, setStats] = useState({
    totalPosts: 0,
    scheduledPosts: 0,
    postedPosts: 0,
    successRate: 0
  })

  // Calculate stats when scheduledPosts change
  useEffect(() => {
    const total = scheduledPosts.length
    const scheduled = scheduledPosts.filter(post => post.status === "scheduled").length
    const posted = scheduledPosts.filter(post => post.status === "posted").length
    const successRate = total > 0 ? Math.round((posted / total) * 100) : 0
    
    setStats({
      totalPosts: total,
      scheduledPosts: scheduled,
      postedPosts: posted,
      successRate: successRate
    })
  }, [scheduledPosts])

  const handleAddPost = () => {
    if (!newPost.content || !newPost.date || !newPost.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    const post: ScheduledPost = {
      id: Date.now().toString(),
      content: newPost.content,
      date: newPost.date,
      time: newPost.time,
      imageUrl: newPost.imageUrl || undefined,
      status: "scheduled"
    }

    setScheduledPosts([...scheduledPosts, post])
    setNewPost({
      content: "",
      date: "",
      time: "",
      imageUrl: ""
    })

    toast({
      title: "Post Scheduled",
      description: "Your post has been scheduled successfully!"
    })
  }

  const handleRemovePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(post => post.id !== id))
  }

  const toggleScheduler = () => {
    setIsSchedulerActive(!isSchedulerActive)
    toast({
      title: isSchedulerActive ? "Scheduler Paused" : "Scheduler Activated",
      description: isSchedulerActive 
        ? "Your content scheduler has been paused" 
        : "Your content scheduler is now active and will post automatically"
    })
  }

  const generate30DaySchedule = () => {
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a topic first",
        variant: "destructive"
      })
      return
    }

    const newPosts: ScheduledPost[] = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const postDate = new Date(today)
      postDate.setDate(today.getDate() + i)
      
      // Format date as YYYY-MM-DD
      const formattedDate = postDate.toISOString().split('T')[0]
      
      // Random time between 9 AM and 8 PM
      const hours = Math.floor(Math.random() * 12) + 9
      const minutes = Math.floor(Math.random() * 4) * 15 // 0, 15, 30, or 45
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      
      const post: ScheduledPost = {
        id: `auto-${Date.now()}-${i}`,
        content: `Exploring ${topic} - Day ${i}. What are your thoughts on this? #${topic.replace(/\s+/g, '')} #DailyUpdate`,
        date: formattedDate,
        time: formattedTime,
        status: "scheduled"
      }
      
      newPosts.push(post)
    }
    
    setScheduledPosts([...scheduledPosts, ...newPosts])
    
    toast({
      title: "30-Day Schedule Generated",
      description: `Created 30 posts about "${topic}" for the next 30 days!`
    })
  }

  // Function to simulate posting (for demo purposes)
  const simulatePost = (id: string) => {
    setScheduledPosts(prev => prev.map(post => 
      post.id === id 
        ? { ...post, status: Math.random() > 0.2 ? "posted" : "failed" } 
        : post
    ))
    
    toast({
      title: "Post Simulation",
      description: "Post status has been updated for demo purposes."
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>

      {/* Header */}
      <DashboardHeader />

      {/* Main Content - 95% width for mobile */}
      <div className="w-[95%] sm:w-[85%] mx-auto py-8 sm:py-12 relative z-10">
        <div className="mb-8 sm:mb-12">
          <Link to="/dashboard" className="flex items-center text-blue-600 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-2xl px-4 py-2 mb-4 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-transparent hover:border-white/30">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="text-lg font-semibold">Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-4 sm:space-x-5 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-5 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 border border-white/20 backdrop-blur-sm">
              <Calendar className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 tracking-tight leading-tight">
                Content Scheduler
              </h1>
              <p className="text-gray-600 text-sm sm:text-base font-medium mt-1">Schedule posts for continuous 30-day engagement</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <Card className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white shadow-2xl rounded-3xl sm:rounded-[2rem] transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(59,130,246,0.4)] border border-white/20 backdrop-blur-sm hover:scale-105 group">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg sm:text-xl font-bold mb-2">Total Posts</p>
                  <p className="text-4xl sm:text-5xl font-black">{stats.totalPosts}</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 backdrop-blur-sm">
                  <BarChart3 className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 text-white shadow-2xl rounded-3xl sm:rounded-[2rem] transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(245,158,11,0.4)] border border-white/20 backdrop-blur-sm hover:scale-105 group">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg sm:text-xl font-bold mb-2">Scheduled</p>
                  <p className="text-4xl sm:text-5xl font-black">{stats.scheduledPosts}</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 backdrop-blur-sm">
                  <Clock className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white shadow-2xl rounded-3xl sm:rounded-[2rem] transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(34,197,94,0.4)] border border-white/20 backdrop-blur-sm hover:scale-105 group">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg sm:text-xl font-bold mb-2">Posted</p>
                  <p className="text-4xl sm:text-5xl font-black">{stats.postedPosts}</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 backdrop-blur-sm">
                  <CheckCircle className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 text-white shadow-2xl rounded-3xl sm:rounded-[2rem] transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(168,85,247,0.4)] border border-white/20 backdrop-blur-sm hover:scale-105 group">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg sm:text-xl font-bold mb-2">Success Rate</p>
                  <p className="text-4xl sm:text-5xl font-black">{stats.successRate}%</p>
                </div>
                <div className="bg-white/20 rounded-2xl p-3 sm:p-4 shadow-xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 backdrop-blur-sm">
                  <TrendingUp className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Scheduler Control Card */}
        <Card className="mb-8 sm:mb-12 bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30">
          <CardHeader className="p-6 sm:p-8 pb-6">
            <CardTitle className="flex items-center justify-between text-2xl sm:text-3xl font-black text-gray-900">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-3 shadow-xl">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <span>Content Scheduler</span>
              </div>
              <div className="flex items-center space-x-4">
                <Switch
                  checked={isSchedulerActive}
                  onCheckedChange={toggleScheduler}
                  className="scale-125"
                />
                <span className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isSchedulerActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700"
                }`}>
                  {isSchedulerActive ? "Active" : "Paused"}
                </span>
              </div>
            </CardTitle>
            <CardDescription className="text-lg sm:text-xl text-gray-600 font-medium mt-3">
              Automatically post content to your X account over 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0">
            <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
              <div className="flex-1">
                <Label htmlFor="topic" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 block">
                  Content Topic
                </Label>
                <Input
                  id="topic"
                  placeholder="Enter your main topic (e.g., AI, Marketing, Fitness)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-14 text-lg sm:text-xl rounded-2xl border-2 border-gray-200/50 focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400/50 bg-white/80 backdrop-blur-sm shadow-lg font-medium px-6"
                />
              </div>
              <Button
                onClick={generate30DaySchedule}
                className="mt-6 lg:mt-8 h-14 text-lg sm:text-xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white rounded-2xl px-8 font-bold shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm"
              >
                <Zap className="h-6 w-6 sm:h-7 sm:w-7 mr-3" />
                Generate 30-Day Schedule
              </Button>
            </div>

            <div className="mt-8 p-6 sm:p-8 bg-gradient-to-r from-blue-50/80 via-purple-50/60 to-pink-50/60 rounded-2xl sm:rounded-3xl border border-blue-200/30 backdrop-blur-sm shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl p-3 shadow-xl flex-shrink-0">
                  <AlertCircle className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">How it works</h3>
                  <p className="text-base sm:text-lg text-blue-700 font-medium leading-relaxed">
                    Enter a topic and we'll generate 30 days of engaging content.
                    The scheduler will automatically post to your X account at random times
                    throughout the day to maximize engagement.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add New Post Card */}
        <Card className="mb-8 sm:mb-12 bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30">
          <CardHeader className="p-6 sm:p-8 pb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-2xl p-3 shadow-xl">
                <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl sm:text-3xl font-black text-gray-900">Add New Post</CardTitle>
                <CardDescription className="text-lg sm:text-xl text-gray-600 font-medium mt-1">
                  Schedule a custom post for a specific date and time
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0">
            <div className="space-y-6 sm:space-y-8">
              <div>
                <Label htmlFor="content" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 block">
                  Post Content
                </Label>
                <Textarea
                  id="content"
                  placeholder="What would you like to post?"
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  rows={4}
                  className="mt-2 text-lg sm:text-xl rounded-2xl border-2 border-gray-200/50 focus:ring-4 focus:ring-green-500/20 focus:border-green-400/50 bg-white/80 backdrop-blur-sm shadow-lg font-medium p-6 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <Label htmlFor="date" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 block">
                    Date
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="date"
                      type="date"
                      value={newPost.date}
                      onChange={(e) => setNewPost({...newPost, date: e.target.value})}
                      className="h-14 text-lg sm:text-xl rounded-2xl border-2 border-gray-200/50 focus:ring-4 focus:ring-green-500/20 focus:border-green-400/50 bg-white/80 backdrop-blur-sm shadow-lg font-medium pl-6 pr-12"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-2 shadow-lg">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="time" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 block">
                    Time
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="time"
                      type="time"
                      value={newPost.time}
                      onChange={(e) => setNewPost({...newPost, time: e.target.value})}
                      className="h-14 text-lg sm:text-xl rounded-2xl border-2 border-gray-200/50 focus:ring-4 focus:ring-green-500/20 focus:border-green-400/50 bg-white/80 backdrop-blur-sm shadow-lg font-medium pl-6 pr-12"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-2 shadow-lg">
                      <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl" className="text-lg sm:text-xl font-bold text-gray-800 mb-3 block">
                  Image URL (Optional)
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="imageUrl"
                    placeholder="https://example.com/image.jpg"
                    value={newPost.imageUrl}
                    onChange={(e) => setNewPost({...newPost, imageUrl: e.target.value})}
                    className="h-14 text-lg sm:text-xl rounded-2xl border-2 border-gray-200/50 focus:ring-4 focus:ring-green-500/20 focus:border-green-400/50 bg-white/80 backdrop-blur-sm shadow-lg font-medium pl-6 pr-12"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-2 shadow-lg">
                    <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddPost}
                className="w-full md:w-auto h-14 text-lg sm:text-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-2xl px-8 font-bold shadow-2xl hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border border-white/20 backdrop-blur-sm"
              >
                <Plus className="h-6 w-6 sm:h-7 sm:w-7 mr-3" />
                Schedule Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Posts */}
        <Card className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30">
          <CardHeader className="p-6 sm:p-8 pb-6">
            <CardTitle className="flex items-center text-2xl sm:text-3xl font-black text-gray-900">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-3 shadow-xl mr-4">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              Scheduled Posts
            </CardTitle>
            <CardDescription className="text-lg sm:text-xl text-gray-600 font-medium mt-2">
              {scheduledPosts.length} posts scheduled for automatic posting
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 sm:p-8 pt-0">
            {scheduledPosts.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="bg-gradient-to-br from-gray-400 to-gray-500 rounded-3xl p-6 shadow-2xl mx-auto w-fit mb-6">
                  <BarChart3 className="h-16 w-16 sm:h-20 sm:w-20 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">No scheduled posts</h3>
                <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-md mx-auto leading-relaxed">
                  Generate a 30-day schedule or add individual posts to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {scheduledPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 sm:p-8 border-2 border-gray-200/50 rounded-2xl sm:rounded-3xl hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm group"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-lg sm:text-xl leading-relaxed mb-4">{post.content}</p>
                        <div className="flex items-center space-x-4 text-gray-600 mb-4">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-2 shadow-lg">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-lg font-semibold">{post.date}</span>
                          <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-2 shadow-lg ml-4">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-lg font-semibold">{post.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                          post.status === "scheduled"
                            ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                            : post.status === "posted"
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                              : "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg"
                        }`}>
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => simulatePost(post.id)}
                          className="text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-white/30"
                        >
                          <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemovePost(post.id)}
                          className="text-gray-500 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 border border-transparent hover:border-white/30"
                        >
                          <Trash2 className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                      </div>
                    </div>
                    {post.imageUrl && (
                      <div className="mt-6">
                        <img
                          src={post.imageUrl}
                          alt="Post preview"
                          className="h-40 sm:h-48 w-full object-cover rounded-2xl sm:rounded-3xl shadow-lg border border-white/30"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}