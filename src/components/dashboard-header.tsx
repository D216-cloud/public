"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Twitter,
  BarChart3,
  Calendar,
  PenTool,
  TrendingUp,
  Settings,
  User,
  LogOut,
  Bell,
  Menu,
  X,
  Zap,
  Mail,
  CheckCircle,
  XCircle,
  Crown,
  ArrowRight,
  Sparkles,
} from "lucide-react"
import { API_URL } from "@/utils/config"

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/ai-writer", label: "AI Writer", icon: PenTool },
  { href: "/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function DashboardHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [twitterStatus, setTwitterStatus] = useState({ connected: false, username: null })
  const [twitterUsername, setTwitterUsername] = useState('')
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  // Fetch Twitter connection status
  useEffect(() => {
    fetchTwitterStatus()
  }, [])

  // Close mobile menu when user menu opens
  useEffect(() => {
    if (isUserMenuOpen) {
      setIsMobileMenuOpen(false)
    }
  }, [isUserMenuOpen])

  const fetchTwitterStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/api/twitter/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setTwitterStatus({
            connected: result.connected,
            username: result.username
          })
        }
      }
    } catch (error) {
      console.error('Error fetching Twitter status:', error)
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleConnectTwitter = async () => {
    if (!twitterUsername.trim()) {
      return
    }

    setIsConnectingTwitter(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/api/twitter/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: twitterUsername })
      })

      const result = await response.json()

      if (result.success) {
        await fetchTwitterStatus()
        setTwitterUsername('')
      }
    } catch (error) {
      console.error('Error connecting Twitter:', error)
    } finally {
      setIsConnectingTwitter(false)
    }
  };

  // Get user data from localStorage
  const getUserData = () => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        return JSON.parse(userString);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const user = getUserData();

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false)
    setIsUserMenuOpen(false)
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-3 group transition-all duration-300" 
              onClick={closeAllMenus}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 overflow-hidden">
                <Twitter className="h-6 w-6 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent group-hover:scale-x-105 transition-transform duration-300">
                  TwitterAI
                </span>
                <span className="text-xs text-blue-600 font-medium hidden sm:block animate-pulse-slow">
                  Pro
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      group relative text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "text-gray-900 font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                      }
                    `}
                    onClick={closeAllMenus}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                    )}
                    {!isActive && (
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">

              {/* User Menu */}
              <DropdownMenu open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        closeAllMenus()
                        setTimeout(() => setIsUserMenuOpen(true), 100)
                      }
                    }}
                  >
                    <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.profileImage || user?.profilePicture} />
                        <AvatarFallback className="text-xs font-bold text-white">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="text-left min-w-0 flex-1 hidden lg:block">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || user?.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{twitterStatus.username ? `@${twitterStatus.username}` : 'Connect Twitter'}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent 
                  className="w-96 p-0 z-[60] mt-2 animate-in slide-in-from-top-2 duration-300" 
                  align="end" 
                  sideOffset={8}
                  forceMount
                  onEscapeKeyDown={closeAllMenus}
                  onInteractOutside={closeAllMenus}
                >
                  {/* User Profile Header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100 animate-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12 ring-2 ring-white/20 shadow-lg">
                        <AvatarImage src={user?.profileImage || user?.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-900 text-base">{user?.name || 'User'}</p>
                        <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Twitter Connection Section */}
                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto animate-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="relative p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                          <Twitter className="h-5 w-5 text-white" />
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${twitterStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">Twitter Account</p>
                          <p className="text-xs text-gray-500">Connect to unlock AI features</p>
                        </div>
                      </div>
                      {twitterStatus.connected ? (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200 shadow-sm animate-in slide-in-from-right-2 duration-300">
                          <div className="p-1.5 bg-green-500 rounded-full">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-green-700">Connected</span>
                        </div>
                      ) : (
                        <Badge className="text-xs border-gray-300 bg-gray-50 font-medium animate-in fade-in duration-200">Not Connected</Badge>
                      )}
                    </div>

                    {!twitterStatus.connected && (
                      <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                        <div className="space-y-3">
                          <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                              <span className="text-gray-400 text-sm font-medium">@</span>
                            </div>
                            <input
                              type="text"
                              placeholder="Enter your Twitter username"
                              value={twitterUsername}
                              onChange={(e) => setTwitterUsername(e.target.value.replace('@', ''))}
                              className="relative z-0 w-full pl-12 pr-4 py-3 text-sm font-medium text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-300 shadow-sm hover:shadow-md"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleConnectTwitter()
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-500 transition-all duration-300 pointer-events-none" />
                          </div>
                          
                          <Button 
                            className={`
                              relative w-full h-12 text-sm font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden
                              ${isConnectingTwitter || !twitterUsername.trim() 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 border-0'
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 animate-in slide-in-from-bottom-1 duration-200
                            `}
                            onClick={handleConnectTwitter}
                            disabled={isConnectingTwitter || !twitterUsername.trim()}
                          >
                            {isConnectingTwitter ? (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : (
                              <span className="relative flex items-center justify-center space-x-2">
                                <Sparkles className="h-4 w-4" />
                                <span>Connect Twitter</span>
                              </span>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 text-center animate-in fade-in duration-300">
                          Enter your Twitter username to unlock AI-powered features
                        </p>
                      </div>
                    )}
                  </div>

                  <DropdownMenuSeparator className="animate-in fade-in duration-200" />

                  <DropdownMenuItem 
                    className="px-4 py-3 cursor-pointer group focus:bg-blue-50 focus:text-blue-600 transition-all duration-200 animate-in slide-in-from-bottom-1 duration-200"
                    onClick={closeAllMenus}
                  >
                    <Link to="/profile" className="flex items-center space-x-3 w-full">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:shadow-md transition-all duration-300">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-300">Profile</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600 focus:bg-red-50 px-4 py-3 cursor-pointer group hover:bg-red-50 transition-all duration-200 animate-in slide-in-from-bottom-2 duration-200" 
                    onClick={() => {
                      handleLogout()
                      closeAllMenus()
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-all duration-300">
                        <LogOut className="h-4 w-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium">Sign out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden relative p-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 group overflow-hidden"
                onClick={() => {
                  setIsUserMenuOpen(false)
                  setIsMobileMenuOpen(!isMobileMenuOpen)
                }}
              >
                <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}>
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Navigation - Slide from Right */}
      <div 
        className={`
          fixed inset-0 z-40 md:hidden transition-all duration-500 ease-in-out
          ${isMobileMenuOpen 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0'
          }
        `}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-500" 
          style={{
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          onClick={() => {
            setIsMobileMenuOpen(false)
            setIsUserMenuOpen(false)
          }}
        />
        
        {/* Slide Panel */}
        <div 
          className={`
            absolute right-0 top-0 h-full w-80 max-w-full bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50
            transition-all duration-500 ease-out transform-gpu
            ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          {/* Mobile Menu Header */}
          <div className="px-6 py-5 bg-white/90 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 shadow-lg">
                  <Twitter className="h-6 w-6 text-white relative z-10" />
                  <div className="absolute inset-0 bg-white/20 rounded-xl animate-ping-slow" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">TwitterAI Pro</h3>
                  <p className="text-xs text-blue-600 font-medium">Navigation</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 relative group h-10 w-10 flex items-center justify-center"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsUserMenuOpen(false)
                }}
              >
                <X className="h-6 w-6 text-gray-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          <div className="py-6 space-y-2 px-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {/* User Profile Section */}
            <div className="px-4 py-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100 mb-6 shadow-sm animate-in slide-in-from-top-1 duration-300">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-white/20 shadow-lg">
                  <AvatarImage src={user?.profileImage || user?.profilePicture} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 text-base">{user?.name || 'User'}</p>
                  <p className="text-sm text-gray-600 truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-1">
              {navigationItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`
                      group relative flex items-center px-4 py-4 text-base font-semibold transition-all duration-200
                      ${isActive
                        ? "text-gray-900 font-semibold"
                        : "text-gray-700 hover:text-gray-900"
                      }
                    `}
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setIsUserMenuOpen(false)
                    }}
                  >
                    <span className="ml-3 flex-1">{item.label}</span>
                    <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                )
              })}
            </div>

            {/* Separator */}
            <div className="my-6 border-t border-gray-200/50 animate-in fade-in duration-300"></div>

            {/* Separator */}
            <div className="my-6 border-t border-gray-200/50 animate-in fade-in duration-300"></div>

            {/* Additional Actions */}
            <div className="space-y-1">
              <Link
                to="/profile"
                className="group relative flex items-center space-x-4 px-4 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 bg-white/80 hover:bg-white border border-gray-200/50 rounded-xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md animate-in slide-in-from-bottom-1 duration-300 w-full text-left"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  setIsUserMenuOpen(false)
                }}
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-gray-100 group-hover:bg-blue-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <User className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-left">Profile</span>
                </div>
                <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </Link>

              {/* Logout Button */}
              <Button
                className="group relative flex items-center space-x-4 px-4 py-4 text-base font-semibold text-red-600 hover:text-red-700 bg-white/80 hover:bg-red-50 border border-gray-200/50 rounded-xl transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md w-full text-left animate-in slide-in-from-bottom-2 duration-300"
                variant="ghost"
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                  setIsUserMenuOpen(false)
                }}
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-red-100 group-hover:bg-red-200 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <LogOut className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-left">Sign out</span>
                </div>
                <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* PricingModal component */}
    </>
  )
}