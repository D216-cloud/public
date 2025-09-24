import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Twitter, Settings, LogOut, Mail, CheckCircle, XCircle, ChevronDown, User, ArrowRight, Sparkles } from "lucide-react"
import { API_URL } from "@/utils/config"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMenuAnimating, setIsMenuAnimating] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [twitterStatus, setTwitterStatus] = useState({ connected: false, username: null })
  const [twitterUsername, setTwitterUsername] = useState('')
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false)
  const [verificationStep, setVerificationStep] = useState('username')
  const [verificationCode, setVerificationCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [pendingTwitterUser, setPendingTwitterUser] = useState<{id: string, username: string, name: string} | null>(null)
  const navigate = useNavigate()

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuAnimating(false)
      setTimeout(() => setIsMenuOpen(false), 300)
    } else {
      setIsMenuOpen(true)
      setIsMenuAnimating(true)
    }
  }

  const closeMenu = () => {
    setIsMenuAnimating(false)
    setTimeout(() => setIsMenuOpen(false), 300)
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userString = localStorage.getItem('user')
    
    if (token && userString) {
      try {
        const user = JSON.parse(userString)
        setUserData(user)
        setIsLoggedIn(true)
        fetchTwitterStatus()
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
  }, [])

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

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUserData(null)
    navigate('/login')
  }

  const handleConnectTwitter = async () => {
    if (!twitterUsername.trim()) {
      return
    }

    setIsConnectingTwitter(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/api/twitter/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: twitterUsername })
      })

      const result = await response.json()

      if (result.success) {
        setGeneratedCode(result.verificationCode)
        setPendingTwitterUser(result.twitterUser)
        setVerificationStep('verification')
      } else {
        console.error('Verification failed:', result.message)
      }
    } catch (error) {
      console.error('Error verifying Twitter:', error)
    } finally {
      setIsConnectingTwitter(false)
    }
  }

  const handleConfirmConnection = async () => {
    if (!verificationCode.trim()) {
      return
    }

    setIsConnectingTwitter(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/api/twitter/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ verificationCode })
      })

      const result = await response.json()

      if (result.success) {
        await fetchTwitterStatus()
        setVerificationStep('username')
        setTwitterUsername('')
        setVerificationCode('')
        setGeneratedCode('')
        setPendingTwitterUser(null)
      } else {
        console.error('Confirmation failed:', result.message)
      }
    } catch (error) {
      console.error('Error confirming Twitter:', error)
    } finally {
      setIsConnectingTwitter(false)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                <Twitter className="h-5 w-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-white/20 rounded-xl transform scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-blue-600 bg-clip-text text-transparent">
                  TwitterAI
                </span>
                <span className="text-xs font-medium text-blue-600">Pro</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!isLoggedIn ? (
              <>
                <nav className="hidden md:flex items-center space-x-8">
                  <Link
                    to="#features"
                    className="group relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
                  >
                    Features
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    to="#pricing"
                    className="group relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
                  >
                    Pricing
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                  <Link
                    to="#how-it-works"
                    className="group relative text-sm font-medium text-gray-700 hover:text-gray-900 transition-all duration-200"
                  >
                    How It Works
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:w-full transition-all duration-300" />
                  </Link>
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                  <button 
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 group relative overflow-hidden"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Demo</span>
                      <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                    </span>
                    <span className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </button>
                  
                  <button
                    onClick={() => navigate('/signup')}
                    className="group relative inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden transform hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Start Now</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-800 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur" />
                  </button>
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="p-1.5 bg-blue-50 rounded-full border border-blue-100">
                    <Twitter className="h-4 w-4 text-blue-600" />
                  </div>
                  {twitterStatus.connected ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none shadow-sm">
                      @{twitterStatus.username}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-300 text-gray-700">
                      Connect Twitter
                    </Badge>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button 
                      className="flex items-center space-x-3 p-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden"
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={userData?.profileImage || userData?.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                          {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{userData?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
                      </div>
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors duration-200">
                        <ChevronDown className="h-3 w-3 text-gray-500 group-hover:rotate-180 transition-transform duration-200" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  
                  <DropdownMenuContent className="w-96 p-0" align="end" forceMount>
                    {/* User Info Card */}
                    <div className="px-4 py-4 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-b border-blue-100">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-white/20">
                          <AvatarImage src={userData?.profileImage || userData?.profilePicture} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                            {userData?.name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-gray-900 text-base">{userData?.name}</p>
                          <p className="text-sm text-gray-600 truncate">{userData?.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Twitter Connection */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                            <Twitter className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Twitter Account</p>
                            <p className="text-xs text-gray-500">Connect to analyze your tweets</p>
                          </div>
                        </div>
                        {twitterStatus.connected ? (
                          <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200">
                            <div className="p-1.5 bg-green-500 rounded-full">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-green-700">Connected</span>
                          </div>
                        ) : (
                          <Badge variant="secondary" className="text-xs border-gray-300 bg-gray-50">Not Connected</Badge>
                        )}
                      </div>

                      {!twitterStatus.connected && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                          {verificationStep === 'username' && (
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
                                  className="relative z-0 w-full pl-12 pr-4 py-4 text-sm font-medium text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleConnectTwitter()
                                    }
                                  }}
                                />
                                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-blue-500 transition-colors duration-200 pointer-events-none" />
                              </div>
                              
                              <button 
                                onClick={handleConnectTwitter}
                                disabled={isConnectingTwitter || !twitterUsername.trim()}
                                className={`
                                  relative w-full h-12 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] overflow-hidden
                                  ${isConnectingTwitter || !twitterUsername.trim() 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 border-0'
                                  }
                                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                `}
                              >
                                {isConnectingTwitter ? (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  </div>
                                ) : (
                                  <span className="relative flex items-center justify-center space-x-2">
                                    <Sparkles className="h-4 w-4" />
                                    <span>Verify Username</span>
                                  </span>
                                )}
                                {!isConnectingTwitter && (
                                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100" />
                                )}
                              </button>
                            </div>
                          )}

                          {verificationStep === 'verification' && (
                            <div className="space-y-4">
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-1">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                  </div>
                                  <div className="flex-1 space-y-3">
                                    <div className="flex items-center space-x-2">
                                      <div className="p-1.5 bg-blue-500 rounded-full">
                                        <CheckCircle className="h-4 w-4 text-white" />
                                      </div>
                                      <h4 className="font-semibold text-sm text-blue-800">Verification Required</h4>
                                    </div>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                      Add this code to your Twitter bio or tweet it from{' '}
                                      <span className="font-mono bg-blue-100 px-1.5 py-0.5 rounded text-blue-900">@{pendingTwitterUser?.username}</span>
                                    </p>
                                    <div className="bg-white p-4 rounded-lg border border-blue-200 shadow-sm">
                                      <div className="flex items-center justify-center space-x-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <p className="text-lg font-mono text-blue-900 font-bold tracking-wider text-center flex-1">
                                          {generatedCode}
                                        </p>
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="relative group">
                                  <input
                                    type="text"
                                    placeholder="Enter verification code"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    className="w-full px-4 py-4 text-sm font-medium text-gray-900 placeholder-gray-500 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-300"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter') {
                                        handleConfirmConnection()
                                      }
                                    }}
                                  />
                                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-green-500 transition-colors duration-200 pointer-events-none" />
                                </div>
                                
                                <button 
                                  onClick={handleConfirmConnection}
                                  disabled={isConnectingTwitter || !verificationCode.trim()}
                                  className={`
                                    relative w-full h-12 text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-[1.02] overflow-hidden
                                    ${isConnectingTwitter || !verificationCode.trim() 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                                      : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 border-0'
                                    }
                                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                                  `}
                                >
                                  {isConnectingTwitter ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    </div>
                                  ) : (
                                    <span className="relative flex items-center justify-center space-x-2">
                                      <CheckCircle className="h-4 w-4" />
                                      <span>Connect Twitter</span>
                                      <ArrowRight className="h-4 w-4" />
                                    </span>
                                  )}
                                  {!isConnectingTwitter && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-green-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100" />
                                  )}
                                </button>
                              </div>

                              <button 
                                onClick={() => {
                                  setVerificationStep('username')
                                  setVerificationCode('')
                                  setGeneratedCode('')
                                  setPendingTwitterUser(null)
                                }}
                                className="w-full h-10 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200 border border-transparent hover:border-gray-200 flex items-center justify-center space-x-1"
                              >
                                <ChevronDown className="h-3 w-3 rotate-180" />
                                <span>Back to Username</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer group">
                        <Link to="/dashboard" className="flex items-center space-x-3 w-full group-hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:shadow-md transition-shadow duration-200">
                            <Twitter className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600">Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="px-4 py-3 cursor-pointer group">
                        <Link to="/settings" className="flex items-center space-x-3 w-full group-hover:bg-gray-50 rounded-lg transition-colors duration-200">
                          <div className="p-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg group-hover:shadow-md transition-shadow duration-200">
                            <Settings className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 group-hover:text-gray-600">Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 px-4 py-3 cursor-pointer group hover:bg-red-50 transition-colors duration-200"
                          onClick={handleLogout}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors duration-200">
                              <LogOut className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="text-sm font-medium">Sign out</span>
                          </div>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 relative group"
              onClick={toggleMenu}
            >
              <div className={`transition-all duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 blur" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide Down Menu */}
      <div 
        className={`
          fixed inset-x-0 top-0 z-40 md:hidden
          ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0'}
          transition-all duration-300 ease-out
          bg-white shadow-2xl border-b border-gray-200
        `}
      >
        {isMenuOpen && (
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={closeMenu} />
        )}
        
        <div className="relative bg-white rounded-b-3xl overflow-hidden">
          {/* Menu Header */}
          <div className="px-4 py-5 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-white opacity-5" />
            <div className="flex items-center justify-between relative z-10">
              <h2 className="text-xl font-bold text-white">
                {isLoggedIn ? 'Menu' : 'Navigation'}
              </h2>
              <button
                onClick={closeMenu}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200 relative group"
              >
                <X className="h-6 w-6 text-white/90" />
                <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
              </button>
            </div>
          </div>

          {/* Menu Content */}
          <div className="py-6 space-y-1 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {!isLoggedIn ? (
              <>
                <div className="space-y-1 px-4">
                  <Link
                    to="#features"
                    className="group relative flex items-center px-4 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-white rounded-2xl transition-all duration-200 overflow-hidden"
                    onClick={closeMenu}
                  >
                    <span className="ml-3 flex-1">Features</span>
                    <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <Link
                    to="#pricing"
                    className="group relative flex items-center px-4 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-white rounded-2xl transition-all duration-200 overflow-hidden"
                    onClick={closeMenu}
                  >
                    <span className="ml-3 flex-1">Pricing</span>
                    <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <Link
                    to="#how-it-works"
                    className="group relative flex items-center px-4 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-white rounded-2xl transition-all duration-200 overflow-hidden"
                    onClick={closeMenu}
                  >
                    <span className="ml-3 flex-1">How It Works</span>
                    <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>
                
                <div className="px-4 py-6 space-y-3 bg-gradient-to-b from-gray-50 to-white rounded-2xl mx-2 mt-4 mb-4 border border-gray-100">
                  <button
                    className="w-full h-14 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md group relative overflow-hidden"
                    onClick={() => {
                      navigate('/demo')
                      closeMenu()
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Sparkles className="h-4 w-4 text-blue-600 group-hover:animate-pulse" />
                      <span>View Demo</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/signup')
                      closeMenu()
                    }}
                    className="group relative w-full h-14 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-xl hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden transform hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    <span className="relative z-10 flex items-center justify-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Start Now</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-800 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm" />
                  </button>
                </div>

                <div className="px-4">
                  <button
                    onClick={() => {
                      navigate('/login')
                      closeMenu()
                    }}
                    className="w-full h-12 text-sm font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transform hover:-translate-y-0.5 group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      Sign In
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out opacity-0 group-hover:opacity-100" />
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* User Profile Card */}
                <div className="px-4 py-6 mx-2 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-100 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-white/30 shadow-lg">
                        <AvatarImage src={userData?.profileImage || userData?.profilePicture} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl font-bold">
                          {userData?.name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 text-lg">{userData?.name}</p>
                      <p className="text-sm text-gray-600 truncate">{userData?.email}</p>
                    </div>
                  </div>

                  {/* Twitter Status */}
                  <div className="mt-6 pt-4 border-t border-blue-200">
                    <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="relative p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                          <Twitter className="h-5 w-5 text-white" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-blue-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">Twitter</p>
                          <p className="text-xs text-gray-500">@{twitterStatus.username || 'Not connected'}</p>
                        </div>
                      </div>
                      {twitterStatus.connected ? (
                        <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-full border border-green-200 shadow-sm">
                          <div className="p-1.5 bg-green-500 rounded-full">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-green-700">Connected</span>
                        </div>
                      ) : (
                        <button
                          className="px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-all duration-200 hover:scale-105"
                          onClick={() => {
                            closeMenu()
                          }}
                        >
                          Connect
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 px-4 mt-6">
                  <Link
                    to="/dashboard"
                    className="group relative flex items-center px-4 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-white rounded-2xl transition-all duration-200 overflow-hidden shadow-sm"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-4 group-hover:shadow-md transition-shadow duration-200">
                      <Twitter className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span>Dashboard</span>
                    </div>
                    <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                  
                  <Link
                    to="/settings"
                    className="group relative flex items-center px-4 py-4 text-base font-semibold text-gray-700 hover:text-gray-900 hover:bg-white rounded-2xl transition-all duration-200 overflow-hidden shadow-sm"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl mr-4 group-hover:shadow-md transition-shadow duration-200">
                      <Settings className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <span>Settings</span>
                    </div>
                    <div className="absolute right-4 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </div>

                {/* Logout */}
                <div className="px-4 py-4 mt-8">
                  <button
                    onClick={() => {
                      handleLogout()
                      closeMenu()
                    }}
                    className="group relative w-full h-14 text-base font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden border border-red-200"
                  >
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-xl group-hover:bg-red-200 transition-colors duration-200">
                        <LogOut className="h-5 w-5 text-red-600" />
                      </div>
                      <span>Sign Out</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 transform -skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
