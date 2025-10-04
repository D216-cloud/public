"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { toast } from "@/hooks/use-toast"
import {
  TrendingUp,
  Send,
  FileText,
  BarChart3,
  Twitter,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface AnalyticsData {
  summary: {
    totalPosts: number;
    postsInPeriod: number;
    totalGenerated: number;
    generatedInPeriod: number;
    period: number;
  };
  breakdown: {
    byPlatform: Array<{ _id: string; count: number }>;
    byStatus: Array<{ _id: string; count: number }>;
  };
  timeline: {
    dailyPosts: Array<{ _id: { year: number; month: number; day: number }; posts: number }>;
    dailyGenerated: Array<{ _id: { year: number; month: number; day: number }; generated: number }>;
  };
  recent: {
    posts: Array<{
      _id: string;
      content: string;
      platform: string;
      status: string;
      createdAt: string;
      externalId?: string;
    }>;
    generated: Array<{
      _id: string;
      prompt: string;
      generatedText: string;
      createdAt: string;
      wordCount: number;
    }>;
  };
}
interface CalendarData {
  year: number;
  month: number;
  monthName: string;
  data: {
    [date: string]: {
      posts: Array<{
        id: string;
        content: string;
        platform: string;
        status: string;
        time: string;
        externalId?: string;
      }>;
      generated: Array<{
        id: string;
        prompt: string;
        content: string;
        time: string;
        wordCount: number;
      }>;
    };
  };
  summary: {
    totalPosts: number;
    totalGenerated: number;
    activeDays: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [period, setPeriod] = useState('30');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  // Auto-load calendar data when component mounts
  useEffect(() => {
    fetchCalendarData();
  }, []);

  // Auto-refresh calendar data every 30 seconds when calendar tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (calendar !== null) {
        console.log('Auto-refreshing calendar data...');
        fetchCalendarData();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [calendar]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view analytics",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch analytics data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarData = async () => {
    try {
      setCalendarLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please log in to view calendar data",
          variant: "destructive",
        });
        return;
      }

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      console.log(`Fetching real-time calendar data for ${year}-${month}`);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/calendar?year=${year}&month=${month}&_t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Real-time calendar data received:', data);
      
      if (data.success) {
        setCalendar(data.calendar);
        setLastRefresh(new Date());
        toast({
          title: "Calendar Updated",
          description: "Latest data loaded successfully",
          variant: "default",
        });
      } else {
        console.error('Calendar API returned error:', data.message);
        toast({
          title: "Error",
          description: data.message || "Failed to fetch calendar data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to fetch calendar data:', error);
      toast({
        title: "Error",
        description: "Failed to load calendar data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCalendarLoading(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Auto-fetch calendar data when month changes
  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const renderCalendar = () => {
    if (!calendar) return null;

    const year = calendar.year;
    const month = calendar.month - 1; // Convert to 0-indexed
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border border-gray-200/50 bg-gray-50/30"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayData = calendar.data[dateKey];
      const hasActivity = dayData && (dayData.posts.length > 0 || dayData.generated.length > 0);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      
      days.push(
        <div key={day} className={`h-32 border border-gray-200/50 p-2 overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
          hasActivity 
            ? 'bg-gradient-to-br from-blue-50/80 to-purple-50/80 hover:from-blue-100/80 hover:to-purple-100/80' 
            : 'bg-white/50 hover:bg-gray-50/80'
        } ${isToday ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}>
          <div className={`font-bold text-sm mb-2 ${isToday ? 'text-blue-600' : 'text-gray-700'} ${hasActivity ? 'text-gray-800' : ''}`}>
            {day}
            {isToday && <span className="text-xs ml-1 text-blue-500">Today</span>}
          </div>
          
          {dayData && (
            <div className="space-y-1">
              {/* Posted Content */}
              {dayData.posts.map((post, idx) => (
                <div key={`post-${idx}`} className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white px-2 py-1 rounded-lg truncate shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative">
                  <div className="flex items-center space-x-1">
                    <Twitter className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate font-medium">Posted</span>
                  </div>
                  <div className="text-xs opacity-90 truncate mt-0.5">
                    {post.content.substring(0, 25)}...
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-gray-900 text-white text-xs rounded-lg p-2 w-48 shadow-xl">
                    <div className="font-medium mb-1">Posted Content</div>
                    <div className="text-gray-300 mb-1">{post.content}</div>
                    <div className="text-gray-400 text-xs">
                      {post.time} • {post.platform || 'X'}
                    </div>
                    {post.externalId && (
                      <div className="text-blue-300 text-xs mt-1">
                        ID: {post.externalId}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Generated Content */}
              {dayData.generated.map((gen, idx) => (
                <div key={`gen-${idx}`} className="text-xs bg-gradient-to-r from-green-500 to-green-600 text-white px-2 py-1 rounded-lg truncate shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative">
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate font-medium">Generated</span>
                  </div>
                  <div className="text-xs opacity-90 truncate mt-0.5">
                    {gen.content.substring(0, 25)}...
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 bg-gray-900 text-white text-xs rounded-lg p-2 w-48 shadow-xl">
                    <div className="font-medium mb-1">AI Generated</div>
                    <div className="text-gray-300 mb-1">{gen.content}</div>
                    <div className="text-gray-400 text-xs">
                      {gen.time} • {gen.wordCount} words
                    </div>
                    <div className="text-green-300 text-xs mt-1">
                      Prompt: {gen.prompt}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Activity indicator */}
              {hasActivity && (
                <div className="text-xs text-gray-500 mt-1 font-medium">
                  {dayData.posts.length > 0 && `${dayData.posts.length} posted`}
                  {dayData.posts.length > 0 && dayData.generated.length > 0 && ' • '}
                  {dayData.generated.length > 0 && `${dayData.generated.length} generated`}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border-2 border-gray-300 rounded-2xl overflow-hidden shadow-lg">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 text-center font-bold text-gray-700 text-sm border-b-2 border-gray-300">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-purple-100/20 to-pink-100/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>

      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex items-center space-x-3 sm:space-x-4 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-4 sm:p-5 shadow-2xl transform transition-all duration-500 hover:scale-110 hover:rotate-3 border border-white/20 backdrop-blur-sm">
            <BarChart3 className="h-7 w-7 sm:h-9 sm:w-9 text-white drop-shadow-lg" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 tracking-tight leading-tight">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium mt-1">Track your posts, generated content, and social media performance</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl sm:rounded-[2rem] shadow-2xl p-6 sm:p-8 lg:p-10 transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white/20 hover:border-white/30">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[400px] bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
              <TabsTrigger value="overview" className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg">Overview</TabsTrigger>
              <TabsTrigger value="posts" className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg">Posts</TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg">Calendar</TabsTrigger>
              <TabsTrigger value="engagement" className="rounded-xl font-semibold transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-lg">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Period Selector */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Time Period</h3>
                <div className="flex flex-wrap gap-3">
                  {['7', '30', '90'].map((days) => (
                    <Button
                      key={days}
                      variant={period === days ? 'default' : 'outline'}
                      onClick={() => setPeriod(days)}
                      size="sm"
                      className={`min-w-[100px] rounded-xl font-semibold transition-all duration-300 ${
                        period === days 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      Last {days} days
                    </Button>
                  ))}
                </div>
              </div>

              {/* Analytics Overview Cards */}
              {analytics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2">Total Posts</p>
                          <p className="text-3xl font-black text-gray-900">{analytics.summary.totalPosts}</p>
                          <p className="text-xs text-blue-600 mt-2 font-medium">
                            +{analytics.summary.postsInPeriod} in last {analytics.summary.period} days
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <Send className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2">Generated Content</p>
                          <p className="text-3xl font-black text-gray-900">{analytics.summary.totalGenerated}</p>
                          <p className="text-xs text-purple-600 mt-2 font-medium">
                            +{analytics.summary.generatedInPeriod} in last {analytics.summary.period} days
                          </p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <FileText className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-indigo-600/20 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2">Active Platforms</p>
                          <p className="text-3xl font-black text-gray-900">
                            {analytics.breakdown.byPlatform.length || 1}
                          </p>
                          <p className="text-xs text-indigo-600 mt-2 font-medium">Connected platforms</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <TrendingUp className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
                    <div className="p-6 relative">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full -mr-10 -mt-10"></div>
                      <div className="flex items-center justify-between relative z-10">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-2">Success Rate</p>
                          <p className="text-3xl font-black text-gray-900">
                            {analytics.breakdown.byStatus.find(s => s._id === 'posted')?.count || 0}
                          </p>
                          <p className="text-xs text-green-600 mt-2 font-medium">Posted successfully</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <BarChart3 className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Recent Activity */}
              {analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Send className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Recent Posts</h3>
                          <p className="text-blue-100 text-sm">Your latest published content</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {analytics.recent.posts.length > 0 ? (
                          analytics.recent.posts.map((post) => (
                            <div key={post._id} className="bg-gray-50/80 rounded-xl p-4 hover:bg-gray-100/80 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50">
                              <div className="flex justify-between items-start mb-3">
                                <Badge variant="outline" className="border-blue-300 text-blue-700 bg-blue-50">{post.platform || 'X'}</Badge>
                                <Badge variant={post.status === 'posted' ? 'default' : 'secondary'} className={post.status === 'posted' ? 'bg-green-500' : ''}>
                                  {post.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-700 mb-3 font-medium">{post.content || 'No content available'}</p>
                              <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500">
                                  {new Date(post.createdAt).toLocaleDateString()} at{' '}
                                  {new Date(post.createdAt).toLocaleTimeString()}
                                </p>
                                {post.externalId && (
                                  <a 
                                    href={`https://twitter.com/i/web/status/${post.externalId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors"
                                  >
                                    View on Twitter →
                                  </a>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <div className="p-4 bg-blue-50 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <Send className="h-8 w-8 text-blue-500" />
                            </div>
                            <p className="text-gray-600 font-medium">No posts yet</p>
                            <p className="text-sm text-gray-500 mt-1">Start creating content to see your posts here!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">AI Generated Content</h3>
                          <p className="text-purple-100 text-sm">Your AI-powered content history</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {analytics.recent.generated.length > 0 ? (
                          analytics.recent.generated.map((gen) => (
                            <div key={gen._id} className="bg-gray-50/80 rounded-xl p-4 hover:bg-gray-100/80 transition-all duration-300 hover:scale-[1.02] border border-gray-200/50">
                              <div className="flex justify-between items-start mb-3">
                                <Badge variant="outline" className="border-purple-300 text-purple-700 bg-purple-50">AI Generated</Badge>
                                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-lg">{gen.wordCount} words</span>
                              </div>
                              <p className="text-sm font-semibold text-gray-900 mb-2">{gen.prompt || 'No prompt available'}</p>
                              <p className="text-sm text-gray-600 mb-3">
                                {gen.generatedText ? gen.generatedText.substring(0, 100) + '...' : 'No content available'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(gen.createdAt).toLocaleDateString()} at{' '}
                                {new Date(gen.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <div className="p-4 bg-purple-50 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                              <Zap className="h-8 w-8 text-purple-500" />
                            </div>
                            <p className="text-gray-600 font-medium">No generated content yet</p>
                            <p className="text-sm text-gray-500 mt-1">Try the AI generator to create amazing content!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

      <TabsContent value="posts" className="space-y-8">
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
              <div className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10"></div>
                <div className="relative z-10">
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <Send className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Total Posts</h3>
                  <div className="text-4xl font-black text-blue-600 mb-3">{analytics.summary.totalPosts}</div>
                  <p className="text-gray-600 font-medium">All time posts</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
              <div className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10"></div>
                <div className="relative z-10">
                  <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Recent Activity</h3>
                  <div className="text-4xl font-black text-green-600 mb-3">{analytics.summary.postsInPeriod}</div>
                  <p className="text-gray-600 font-medium">Posts in last {period} days</p>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden group">
              <div className="p-8 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10"></div>
                <div className="relative z-10">
                  <div className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Generated Content</h3>
                  <div className="text-4xl font-black text-purple-600 mb-3">{analytics.summary.totalGenerated}</div>
                  <p className="text-gray-600 font-medium">AI generated pieces</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </TabsContent>

      <TabsContent value="calendar" className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100/50 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {calendar?.monthName || new Date().toLocaleString('default', { month: 'long' })} {calendar?.year || new Date().getFullYear()}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {calendar ? `Showing ${calendar.summary.totalPosts} posts and ${calendar.summary.totalGenerated} generated content` : 'Loading content calendar...'}
              {lastRefresh && (
                <span className="ml-2 text-xs text-green-600 font-medium">
                  • Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')} className="rounded-xl border-gray-300 hover:border-indigo-400 hover:bg-indigo-50">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Prev</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setCurrentDate(new Date());
                fetchCalendarData();
              }}
              className="rounded-xl border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 font-semibold"
            >
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateMonth('next')} className="rounded-xl border-gray-300 hover:border-indigo-400 hover:bg-indigo-50">
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchCalendarData}
              disabled={calendarLoading}
              className="rounded-xl bg-blue-50 border-blue-300 text-blue-700 hover:bg-blue-100 font-semibold disabled:opacity-50"
            >
              {calendarLoading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2"></div>
                  Refreshing...
                </>
              ) : (
                <>🔄 Refresh</>
              )}
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {(calendar === null || calendarLoading) && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {calendarLoading ? 'Refreshing Calendar Data...' : 'Loading Your Content Calendar'}
            </h3>
            <p className="text-gray-600">
              {calendarLoading ? 'Getting the latest posts and generated content...' : 'Fetching all your posts and generated content...'}
            </p>
            {lastRefresh && (
              <p className="text-xs text-gray-500 mt-2">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}

        {/* Calendar Summary */}
        {calendar && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
              <div className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">{calendar.summary.totalPosts}</div>
                  <div className="text-gray-600 font-medium">Posts this month</div>
                </div>
              </div>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
              <div className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-black text-green-600 mb-2 group-hover:scale-110 transition-transform">{calendar.summary.totalGenerated}</div>
                  <div className="text-gray-600 font-medium">Generated content</div>
                </div>
              </div>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
              <div className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-black text-purple-600 mb-2 group-hover:scale-110 transition-transform">{calendar.summary.activeDays}</div>
                  <div className="text-gray-600 font-medium">Active days</div>
                </div>
              </div>
            </Card>
            <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group">
              <div className="p-6 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full -mr-10 -mt-10"></div>
                <div className="relative z-10">
                  <div className="text-3xl font-black text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                    {calendar.summary.totalPosts + calendar.summary.totalGenerated}
                  </div>
                  <div className="text-gray-600 font-medium">Total content</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Content Overview */}
        {calendar && (
          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">All Content in {calendar.monthName} {calendar.year}</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* All Posts */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-blue-500 rounded-xl">
                      <Send className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-blue-900">All Posted Content</h4>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(calendar.data)
                      .filter(([_, dayData]) => dayData.posts.length > 0)
                      .map(([date, dayData]) => 
                        dayData.posts.map((post, idx) => (
                          <div key={`${date}-post-${idx}`} className="bg-white/80 rounded-xl p-3 border border-blue-200">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-bold text-blue-700">
                                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <Badge className="bg-blue-500 text-white text-xs">{post.platform || 'X'}</Badge>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{post.content}</p>
                            <div className="flex justify-between items-center text-xs text-gray-500">
                              <span>{post.time}</span>
                              {post.externalId && (
                                <a 
                                  href={`https://twitter.com/i/web/status/${post.externalId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  View →
                                </a>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    {Object.values(calendar.data).every(dayData => dayData.posts.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Send className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No posts found for this month</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* All Generated Content */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-500 rounded-xl">
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-green-900">All Generated Content</h4>
                  </div>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {Object.entries(calendar.data)
                      .filter(([_, dayData]) => dayData.generated.length > 0)
                      .map(([date, dayData]) => 
                        dayData.generated.map((gen, idx) => (
                          <div key={`${date}-gen-${idx}`} className="bg-white/80 rounded-xl p-3 border border-green-200">
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-sm font-bold text-green-700">
                                {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              <Badge className="bg-green-500 text-white text-xs">{gen.wordCount} words</Badge>
                            </div>
                            <p className="text-xs text-green-800 font-medium mb-1">"{gen.prompt}"</p>
                            <p className="text-sm text-gray-700 mb-2">{gen.content}</p>
                            <span className="text-xs text-gray-500">{gen.time}</span>
                          </div>
                        ))
                      )}
                    {Object.values(calendar.data).every(dayData => dayData.generated.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <Zap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No generated content found for this month</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Legend */}
        {calendar && (
          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Calendar Legend</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Posted Content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm"></div>
                  <span className="text-gray-700 font-medium">Generated Content</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg"></div>
                  <span className="text-gray-700 font-medium">Active Days</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full ring-2 ring-blue-300"></div>
                  <span className="text-gray-700 font-medium">Today</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Interactive Calendar Grid */}
        {calendar && (
          <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Interactive Content Calendar</h3>
                <div className="text-sm text-gray-600">
                  📅 Hover over dates for details • Click to see all content for that day
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4">
                {renderCalendar()}
              </div>
              
              {/* Calendar Statistics */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-lg font-bold text-blue-600">
                    {Object.values(calendar.data).reduce((acc, day) => acc + day.posts.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total Posts</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-lg font-bold text-green-600">
                    {Object.values(calendar.data).reduce((acc, day) => acc + day.generated.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Total Generated</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-lg font-bold text-purple-600">
                    {Object.keys(calendar.data).filter(date => calendar.data[date].posts.length > 0 || calendar.data[date].generated.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Days with Activity</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <div className="text-lg font-bold text-orange-600">
                    {Math.round((Object.keys(calendar.data).filter(date => calendar.data[date].posts.length > 0 || calendar.data[date].generated.length > 0).length / new Date(calendar.year, calendar.month, 0).getDate()) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium">Activity Rate</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="engagement" className="space-y-8">
        <Card className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-0">
          <div className="text-center py-16">
            <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl w-32 h-32 mx-auto mb-8 flex items-center justify-center">
              <BarChart3 className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Engagement Analytics</h3>
            <p className="text-gray-600 mb-3 text-lg">Coming Soon!</p>
            <p className="text-gray-500 max-w-md mx-auto">Track likes, retweets, comments, and detailed engagement metrics to understand your audience better.</p>
          </div>
        </Card>
      </TabsContent>
      </Tabs>
      </div>
      </main>
    </div>
  );
}