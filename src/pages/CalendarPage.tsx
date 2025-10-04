"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { toast } from "@/hooks/use-toast"
import {
  CalendarIcon,
  Send,
  FileText,
  BarChart3,
  Twitter,
  Zap,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Filter,
  Search,
} from "lucide-react"

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


interface PostData {
  _id: string;
  content: string;
  platform: string;
  status: string;
  createdAt: string;
  externalId?: string;
}

interface GeneratedData {
  _id: string;
  prompt: string;
  generatedText: string;
  createdAt: string;
  wordCount: number;
}

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<CalendarData | null>(null);
  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [allGenerated, setAllGenerated] = useState<GeneratedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, posts, generated

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing calendar data...');
      fetchAllData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Auto-fetch calendar data when month changes
  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchAllData = async () => {
    await Promise.all([
      fetchCalendarData(),
      fetchAllPosts(),
      fetchAllGenerated()
    ]);
    setLoading(false);
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

  const fetchAllPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts?_t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllPosts(data.posts || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch all posts:', error);
    }
  };

  const fetchAllGenerated = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate/history?_t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAllGenerated(data.generated || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch generated content:', error);
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

  // Filter content based on search and filter type
  const getFilteredPosts = () => {
    return allPosts.filter((post: PostData) => 
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterType === 'all' || filterType === 'posts')
    );
  };

  const getFilteredGenerated = () => {
    return allGenerated.filter((gen: GeneratedData) => 
      (gen.generatedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
       gen.prompt.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterType === 'all' || filterType === 'generated')
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'posted': { variant: 'default' as const, icon: Send, color: 'bg-green-500' },
      'scheduled': { variant: 'secondary' as const, icon: Clock, color: 'bg-blue-500' },
      'draft': { variant: 'outline' as const, icon: FileText, color: 'bg-gray-500' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="w-3 h-3" />
        <span className="capitalize">{status}</span>
      </Badge>
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
              <p className="text-gray-600">Loading calendar data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header with Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Content Calendar & Library
            </h1>
            <p className="text-gray-600 text-lg">
              View all your posts and generated content in one place
            </p>
            {lastRefresh && (
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Posts</CardTitle>
              <Send className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{allPosts.length}</div>
              <p className="text-xs text-gray-500 mt-1">All time posts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Generated Content</CardTitle>
              <Zap className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{allGenerated.length}</div>
              <p className="text-xs text-gray-500 mt-1">AI generated texts</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
              <CalendarIcon className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {calendar?.summary?.totalPosts || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Posts this month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Days</CardTitle>
              <TrendingUp className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {calendar?.summary?.activeDays || 0}
              </div>
              <p className="text-xs text-gray-500 mt-1">Days with activity</p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Display */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {calendar?.monthName} {calendar?.year}
                </CardTitle>
                <CardDescription>
                  Your content activity calendar
                  {calendarLoading && <span className="ml-2 text-blue-500">Refreshing...</span>}
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => navigateMonth('prev')}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm border-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => navigateMonth('next')}
                  variant="outline"
                  size="sm"
                  className="bg-white/80 backdrop-blur-sm border-gray-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderCalendar()}
          </CardContent>
        </Card>

        {/* All Posts Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">All Posts</CardTitle>
            <CardDescription>View all your posted content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {getFilteredPosts().length === 0 ? (
                <div className="text-center py-8">
                  <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No posts found</h3>
                  <p className="text-gray-500">No posts available yet</p>
                </div>
              ) : (
                getFilteredPosts().map((post) => (
                  <div key={post._id} className="bg-gradient-to-r from-blue-50 to-purple-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Twitter className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Social Media Post</h3>
                          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(post.status)}
                        <Badge variant="outline" className="text-xs">
                          {post.platform || 'X'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-gray-800 leading-relaxed">{post.content}</p>
                    </div>
                    
                    {post.externalId && (
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">
                          External ID: {post.externalId}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Content Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">Generated Content</CardTitle>
            <CardDescription>AI-generated content library</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {getFilteredGenerated().length === 0 ? (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No generated content found</h3>
                  <p className="text-gray-500">No generated content available yet</p>
                </div>
              ) : (
                getFilteredGenerated().map((generated) => (
                  <div key={generated._id} className="bg-gradient-to-r from-green-50 to-blue-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">AI Generated Content</h3>
                          <p className="text-sm text-gray-500">{formatDate(generated.createdAt)}</p>
                        </div>
                      </div>
                      
                      <Badge variant="secondary" className="text-xs">
                        {generated.wordCount} words
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Prompt:</h4>
                        <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border">
                          {generated.prompt}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-1">Generated Text:</h4>
                        <p className="text-gray-800 leading-relaxed bg-white p-3 rounded border">
                          {generated.generatedText}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
