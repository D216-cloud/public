"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  TrendingUp,
  Users,
  Heart,
  Repeat,
  MessageCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  Sparkles,
  Search,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const followerData = [
  { date: "Jan 1", followers: 1200, gained: 45, lost: 12 },
  { date: "Jan 2", followers: 1250, gained: 62, lost: 8 },
  { date: "Jan 3", followers: 1180, gained: 28, lost: 35 },
  { date: "Jan 4", followers: 1320, gained: 78, lost: 15 },
  { date: "Jan 5", followers: 1450, gained: 95, lost: 18 },
  { date: "Jan 6", followers: 1380, gained: 42, lost: 28 },
  { date: "Jan 7", followers: 1520, gained: 88, lost: 22 },
]

const engagementData = [
  { date: "Jan 1", likes: 234, retweets: 45, comments: 28, impressions: 2400 },
  { date: "Jan 2", likes: 456, retweets: 78, comments: 45, impressions: 3200 },
  { date: "Jan 3", likes: 189, retweets: 32, comments: 19, impressions: 1800 },
  { date: "Jan 4", likes: 567, retweets: 89, comments: 56, impressions: 4100 },
  { date: "Jan 5", likes: 678, retweets: 123, comments: 67, impressions: 5200 },
  { date: "Jan 6", likes: 345, retweets: 67, comments: 34, impressions: 2900 },
  { date: "Jan 7", likes: 789, retweets: 145, comments: 89, impressions: 6100 },
]

const topPosts = [
  {
    id: 1,
    content: "🚀 Just launched our new AI-powered feature! The future of content creation is here.",
    date: "2024-01-07",
    likes: 789,
    retweets: 145,
    comments: 89,
    impressions: 6100,
    engagementRate: 16.8,
  },
  {
    id: 2,
    content: "💡 Pro tip: Batch similar tasks together to maximize your productivity.",
    date: "2024-01-05",
    likes: 678,
    retweets: 123,
    comments: 67,
    engagementRate: 16.7,
  },
  {
    id: 3,
    content: "Monday motivation: Success isn't about being perfect, it's about being consistent.",
    date: "2024-01-04",
    likes: 567,
    retweets: 89,
    comments: 56,
    engagementRate: 17.4,
  },
]

const audienceData = [
  { name: "18-24", value: 15, color: "#8884d8" },
  { name: "25-34", value: 35, color: "#82ca9d" },
  { name: "35-44", value: 28, color: "#ffc658" },
  { name: "45-54", value: 15, color: "#ff7300" },
  { name: "55+", value: 7, color: "#00ff00" },
]

const timeData = [
  { hour: "6AM", engagement: 12 },
  { hour: "9AM", engagement: 45 },
  { hour: "12PM", engagement: 78 },
  { hour: "3PM", engagement: 89 },
  { hour: "6PM", engagement: 95 },
  { hour: "9PM", engagement: 67 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("overview")

  const formatNumber = (num: number | undefined | null) => {
    if (num == null || num === undefined) {
      return "0"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 pt-28">
      <DashboardHeader />

      <main className="container mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Search and filters bar */}
        <div className="mb-6 sm:mb-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search dashboard..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-3">
              <Select defaultValue="All Time">
                <SelectTrigger className="h-10 border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Time">All Time</SelectItem>
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
                  <SelectItem value="This Month">This Month</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="All Metrics">
                <SelectTrigger className="h-10 border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white">
                  <SelectValue placeholder="All Metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Metrics">All Metrics</SelectItem>
                  <SelectItem value="Engagement">Engagement</SelectItem>
                  <SelectItem value="Growth">Growth</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14 bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <TabsTrigger
              value="overview"
              className="text-xs sm:text-sm h-10 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="engagement"
              className="text-xs sm:text-sm h-10 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all"
            >
              Engagement
            </TabsTrigger>
            <TabsTrigger
              value="audience"
              className="text-xs sm:text-sm h-10 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all"
            >
              Audience
            </TabsTrigger>
            <TabsTrigger
              value="content"
              className="text-xs sm:text-sm h-10 rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm transition-all"
            >
              Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Followers Card */}
              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Total Followers</CardTitle>
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-gray-900 mb-1">1,520</div>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+12.5% from last week</span>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Rate Card */}
              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Engagement Rate</CardTitle>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-gray-900 mb-1">8.2%</div>
                  <div className="flex items-center text-xs text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <span>+2.1% from last week</span>
                  </div>
                </CardContent>
              </Card>

              {/* Scheduled Posts Card */}
              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">Scheduled Posts</CardTitle>
                    <Calendar className="h-5 w-5 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-gray-900 mb-1">24</div>
                  <div className="flex items-center text-xs text-orange-600">
                    <span className="mr-1">⏱️</span>
                    <span>Next in 2 hours</span>
                  </div>
                </CardContent>
              </Card>

              {/* AI Credits Card */}
              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-700">AI Credits</CardTitle>
                    <Sparkles className="h-5 w-5 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold text-gray-900 mb-1">156</div>
                  <div className="text-xs text-gray-500">Resets in 12 days</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-2 rounded-lg mr-3">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Growth Analytics</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Your follower growth and engagement over the last week
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                    <AreaChart data={followerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="followers"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <div className="flex items-center">
                    <div className="bg-purple-50 p-2 rounded-lg mr-3">
                      <BarChart className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">Post Performance</CardTitle>
                      <CardDescription className="text-sm text-gray-500">
                        Daily post count and engagement metrics
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                    <BarChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="likes" fill="#ec4899" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="retweets" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="comments" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8">
              <Card className="xl:col-span-2 hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Engagement Over Time</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Track your engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                    <LineChart data={engagementData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="likes" stroke="#ec4899" strokeWidth={2} />
                      <Line type="monotone" dataKey="retweets" stroke="#8b5cf6" strokeWidth={2} />
                      <Line type="monotone" dataKey="comments" stroke="#06b6d4" strokeWidth={2} />
                      <Line type="monotone" dataKey="impressions" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Best Posting Times</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    When your audience is most active
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ResponsiveContainer width="100%" height={300} className="sm:h-[400px]">
                    <BarChart data={timeData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" fontSize={12} />
                      <YAxis dataKey="hour" type="category" fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="engagement" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audience" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Audience Demographics</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Age distribution of your followers
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                    <PieChart>
                      <Pie
                        data={audienceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {audienceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
                <CardHeader className="p-4 pt-5 pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Follower Growth Rate</CardTitle>
                  <CardDescription className="text-sm text-gray-500">
                    Daily follower gains and losses
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                    <BarChart data={followerData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Bar dataKey="gained" fill="#10b981" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="lost" fill="#ef4444" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 sm:space-y-6">
            <Card className="hover:shadow-md transition-shadow border border-gray-200 bg-white rounded-xl">
              <CardHeader className="p-4 pt-5 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900">Top Performing Posts</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Your most engaging content from the past week
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3 sm:space-y-4">
                  {topPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className="flex flex-col sm:flex-row sm:items-start justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors space-y-3 sm:space-y-0"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                            #{index + 1}
                          </Badge>
                          <span className="text-xs text-gray-500">{post.date}</span>
                        </div>
                        <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Heart className="h-3 w-3 mr-1 text-red-500" />
                            {formatNumber(post.likes)}
                          </span>
                          <span className="flex items-center">
                            <Repeat className="h-3 w-3 mr-1 text-green-500" />
                            {formatNumber(post.retweets)}
                          </span>
                          <span className="flex items-center">
                            <MessageCircle className="h-3 w-3 mr-1 text-blue-500" />
                            {formatNumber(post.comments)}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {formatNumber(post.impressions)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right sm:ml-4">
                        <div className="text-base font-bold text-green-600">
                          {formatNumber(post.engagementRate)}%
                        </div>
                        <div className="text-xs text-gray-500">Engagement Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}