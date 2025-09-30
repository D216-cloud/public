"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { 
  Twitter, 
  Trash2, 
  Download, 
  Upload, 
  Camera, 
  User, 
  LogOut, 
  CheckCircle, 
  Crown, 
  Bell, 
  Shield, 
  CreditCard, 
  Bot, 
  Globe, 
  Lock, 
  Mail, 
  Smartphone, 
  Heart, 
  MessageCircle, 
  AtSign, 
  Clock, 
  Calendar,
  Key,
  FileText,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Users,
  Zap,
  Sparkles,
  Palette,
  Languages,
  Monitor,
  Settings
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "@/utils/config"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface UserData {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  profileImage?: string | null;
  twitterConnected?: boolean;
  twitterUsername?: string;
  twitterId?: string;
}

interface TwitterStatus {
  connected: boolean;
  username: string | null;
  twitterId: string | null;
  profileImageUrl: string | null;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [profileImage, setProfileImage] = useState("/diverse-user-avatars.png")
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [twitterStatus, setTwitterStatus] = useState<TwitterStatus>({ connected: false, username: null, twitterId: null, profileImageUrl: null })
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false)
  const [twitterUsername, setTwitterUsername] = useState('')
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    engagement: true,
    followers: false,
    mentions: true,
    directMessages: true,
  })

  const [autoPosting, setAutoPosting] = useState({
    enabled: true,
    timezone: "America/New_York",
    optimalTimes: true,
    weekendsOnly: false,
  })

  // Get user data from localStorage and fetch Twitter status
  useEffect(() => {
    const userString = localStorage.getItem('user')
    if (userString) {
      try {
        const user = JSON.parse(userString)
        setUserData(user)
        setProfileImage(user.profileImage || user.profilePicture || "/diverse-user-avatars.png")
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }
    
    // Fetch Twitter connection status
    fetchTwitterStatus()
  }, [])

  // Add a function to refresh Twitter status
  const refreshTwitterStatus = async () => {
    await fetchTwitterStatus()
  }

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
            connected: result.connected || false,
            username: result.screenName || result.username || null,
            twitterId: result.twitterId || null,
            profileImageUrl: result.profileImageUrl || null
          })
        }
      } else {
        // Handle HTTP errors
        console.error('Failed to fetch Twitter status:', response.status, response.statusText)
        // Set default state on error
        setTwitterStatus({ connected: false, username: null, twitterId: null, profileImageUrl: null })
      }
    } catch (error) {
      console.error('Error fetching Twitter status:', error)
      // Set default state on error
      setTwitterStatus({ connected: false, username: null, twitterId: null, profileImageUrl: null })
    }
  }

  // Handle logout
  const handleLogout = () => {
    // Show success message first
    toast({
      title: "✅ Logged Out Successfully!",
      description: "You have been logged out successfully. Redirecting to login page...",
      duration: 2000,
    })
    
    // Clear user data and token
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirect after showing the toast
    setTimeout(() => {
      navigate('/login')
    }, 2000)
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }

      setIsUploadingImage(true)
      
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          alert('Please log in to upload image')
          return
        }

        const formData = new FormData()
        formData.append('image', file)
        
        const response = await fetch(`${API_URL}/api/auth/upload-image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })
        
        if (response.ok) {
          const updatedUser = await response.json()
          // Update localStorage with new user data
          localStorage.setItem('user', JSON.stringify(updatedUser))
          setUserData(updatedUser)
          setProfileImage(updatedUser.profileImage || updatedUser.profilePicture)
          
          // Show success message
          alert('Profile image updated successfully!')
        } else {
          const errorData = await response.json()
          console.error('Failed to upload image:', errorData)
          alert('Failed to upload image. Please try again.')
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('Error uploading image. Please check your connection and try again.')
      } finally {
        setIsUploadingImage(false)
        // Clear the input value so the same file can be selected again
        if (event.target) {
          event.target.value = ''
        }
      }
    }
  }

  // Handle image removal
  const handleRemoveImage = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // For now, we'll just remove the image locally
      // You could also create an API endpoint to delete the image from Cloudinary
      const updatedUserData = { ...userData, profileImage: null }
      localStorage.setItem('user', JSON.stringify(updatedUserData))
      setUserData(updatedUserData as UserData)
      setProfileImage("/diverse-user-avatars.png")
      
      alert('Profile image removed successfully!')
    } catch (error) {
      console.error('Error removing image:', error)
      alert('Error removing image. Please try again.')
    }
  }

  // Handle Twitter connection
  const handleConnectTwitter = async () => {
    if (!twitterUsername.trim()) {
      toast({
        title: "Username required",
        description: "Please enter your Twitter username",
        variant: "destructive"
      })
      return
    }

    setIsConnectingTwitter(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Verify Twitter username exists without OAuth redirect
      const response = await fetch(`${API_URL}/api/twitter/verify-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: twitterUsername.trim() })
      })

      const result = await response.json()

      if (result.success) {
        // Update twitterStatus with profile image if available
        if (result.profileImageUrl) {
          setTwitterStatus(prev => ({
            ...prev,
            profileImageUrl: result.profileImageUrl
          }))
        }
        
        // Username exists, show email verification form
        setShowEmailVerification(true)
        toast({
          title: "Username verified",
          description: `@${twitterUsername.trim()} found on X. Please enter your email for verification.`
        })
      } else {
        // Handle specific error cases
        let errorMessage = result.message || "Please check your Twitter username"
        
        if (response.status === 401) {
          errorMessage = "Twitter API authentication failed. Please contact support."
        } else if (response.status === 404) {
          errorMessage = "Twitter username not found. Please check the username and try again."
        } else if (response.status === 429) {
          errorMessage = "Twitter API rate limit exceeded. Please try again later."
        } else if (response.status >= 500) {
          errorMessage = "Twitter verification service temporarily unavailable. Please try again later."
        }
        
        toast({
          title: "Verification failed",
          description: errorMessage,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error connecting Twitter:', error)
      const errorMessage = error instanceof Error ? error.message : "Please check your connection and try again"
      toast({
        title: "Connection error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsConnectingTwitter(false)
    }
  }

  // Send verification code to email
  const handleSendVerificationCode = async () => {
    if (!verificationEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      })
      return
    }

    setIsSendingCode(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Get Twitter ID from previous verification
      const twitterResponse = await fetch(`${API_URL}/api/twitter/verify-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: twitterUsername.trim() })
      })

      const twitterResult = await twitterResponse.json()
      if (!twitterResult.success) {
        throw new Error("Failed to verify Twitter username")
      }

      // Send verification code to email
      const response = await fetch(`${API_URL}/api/twitter/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          twitterId: twitterResult.userId,
          email: verificationEmail.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Code sent",
          description: "Verification code sent to your email. Please check your inbox."
        })
      } else {
        throw new Error(result.message || "Failed to send verification code")
      }
    } catch (error) {
      console.error('Error sending verification code:', error)
      const errorMessage = error instanceof Error ? error.message : "Please check your connection and try again";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSendingCode(false)
    }
  }

  // Verify the code sent to email
  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast({
        title: "Code required",
        description: "Please enter the verification code",
        variant: "destructive"
      })
      return
    }

    setIsVerifyingCode(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Get Twitter ID from previous verification
      const twitterResponse = await fetch(`${API_URL}/api/twitter/verify-username`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: twitterUsername.trim() })
      })

      const twitterResult = await twitterResponse.json()
      if (!twitterResult.success) {
        throw new Error("Failed to verify Twitter username")
      }

      // Verify the code
      const response = await fetch(`${API_URL}/api/twitter/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          twitterId: twitterResult.userId,
          otp: verificationCode.trim()
        })
      })

      const result = await response.json()

      if (result.success) {
        // Connect Twitter account directly after successful verification
        const connectResponse = await fetch(`${API_URL}/api/twitter/connect-direct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ username: twitterUsername.trim() })
        })

        const connectResult = await connectResponse.json()
        
        if (connectResult.success) {
          // Update the twitterStatus with the profile image if available
          if (connectResult.profileImageUrl) {
            setTwitterStatus(prev => ({
              ...prev,
              connected: true,
              username: twitterUsername.trim(),
              profileImageUrl: connectResult.profileImageUrl
            }))
          }
          
          await fetchTwitterStatus() // Refresh status
          setShowEmailVerification(false)
          setVerificationEmail('')
          setVerificationCode('')
          toast({
            title: "Connected Successfully",
            description: `Connected to @${twitterUsername.trim()} and verified your email!`
          })
        } else {
          throw new Error(connectResult.message || "Failed to connect Twitter account")
        }
      } else {
        throw new Error(result.message || "Invalid verification code")
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      const errorMessage = error instanceof Error ? error.message : "Please check your connection and try again";
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsVerifyingCode(false)
    }
  }

  // Handle Twitter disconnection
  const handleDisconnectTwitter = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_URL}/api/twitter/disconnect`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        await fetchTwitterStatus() // Refresh status
        toast({
          title: "Disconnected",
          description: "Twitter account disconnected successfully",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to disconnect Twitter account",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error disconnecting Twitter:', error)
      toast({
        title: "Error",
        description: "Please try again",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 pt-16">
      <DashboardHeader />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-all duration-300">
            <Settings className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 tracking-tight">
            Settings
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Customize your experience and manage your account preferences with our comprehensive settings panel
          </p>
          <div className="flex items-center justify-center mt-6 space-x-2">
            <div className="h-1 w-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
            <div className="h-2 w-2 bg-purple-600 rounded-full animate-pulse"></div>
            <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <div className="w-full overflow-x-auto">
            <TabsList className="grid grid-cols-6 min-w-[600px] sm:min-w-0 h-16 bg-white/90 backdrop-blur-xl shadow-xl border border-white/20 rounded-2xl p-2">
              <TabsTrigger
                value="profile"
                className="text-xs sm:text-sm px-3 sm:px-6 h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/50"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline font-medium">Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="text-xs sm:text-sm px-3 sm:px-6 h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/50"
              >
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline font-medium">Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="text-xs sm:text-sm px-3 sm:px-6 h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/50"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline font-medium">Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="automation"
                className="text-xs sm:text-sm px-3 sm:px-6 h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/50"
              >
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline font-medium">Automation</span>
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="text-xs sm:text-sm px-3 sm:px-6 h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/50"
              >
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline font-medium">Billing</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="text-xs sm:text-sm px-3 sm:px-6 h-12 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:scale-105 transition-all duration-300 hover:bg-white/50"
              >
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="hidden sm:inline font-medium">Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-6 sm:space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Profile Information
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Update your personal information and manage your account details
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-12">
                  <div className="relative group">
                    <div className="relative">
                      <Avatar className="h-32 w-32 sm:h-36 sm:w-36 ring-8 ring-white/50 shadow-2xl border-4 border-white">
                        <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" className="object-cover" />
                        <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
                          {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/30 via-purple-400/30 to-pink-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
                    </div>
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent shadow-lg"></div>
                      </div>
                    )}
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="absolute -bottom-3 -right-3 h-12 w-12 p-0 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl hover:shadow-2xl transition-all duration-300 border-4 border-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-110"
                    >
                      <Camera className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center lg:items-start space-y-4 text-center lg:text-left">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-1">{userData?.name || "User"}</h3>
                      <p className="text-lg text-slate-600 mb-3">{userData?.email || "user@example.com"}</p>
                      <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-800 border-0 px-4 py-2 rounded-full shadow-sm">
                        <Crown className="h-4 w-4 mr-2" />
                        <span className="font-semibold">Pro Member</span>
                      </Badge>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => imageInputRef.current?.click()}
                        disabled={isUploadingImage}
                        className="h-11 px-6 border-2 border-slate-300 hover:border-blue-400 hover:bg-blue-50 rounded-xl transition-all duration-300 font-medium shadow-sm hover:shadow-md"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        <span>Change Photo</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 h-11 px-6 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium border-2 border-red-200 hover:border-red-300"
                        onClick={handleRemoveImage}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Remove</span>
                      </Button>
                    </div>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="firstName" className="text-sm font-semibold text-slate-700 flex items-center">
                      <User className="h-4 w-4 mr-2 text-blue-600" />
                      Full Name
                    </Label>
                    <div className="relative group">
                      <Input
                        id="firstName"
                        value={userData?.name || ""}
                        readOnly
                        className="h-14 pl-12 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm">
                        <User className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700 flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-blue-600" />
                      Email Address
                    </Label>
                    <div className="relative group">
                      <Input
                        id="email"
                        type="email"
                        value={userData?.email || ""}
                        readOnly
                        className="h-14 pl-12 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm">
                        <Mail className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="userId" className="text-sm font-semibold text-slate-700 flex items-center">
                      <Key className="h-4 w-4 mr-2 text-blue-600" />
                      User ID
                    </Label>
                    <div className="relative group">
                      <Input
                        id="userId"
                        value={userData?._id || ""}
                        readOnly
                        className="h-14 pl-12 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm">
                        <Key className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="timezone" className="text-sm font-semibold text-slate-700 flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-blue-600" />
                      Timezone
                    </Label>
                    <div className="relative group">
                      <Select defaultValue="america-new-york">
                        <SelectTrigger className="h-14 pl-12 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america-new-york">America/New York</SelectItem>
                          <SelectItem value="america-los-angeles">America/Los Angeles</SelectItem>
                          <SelectItem value="europe-london">Europe/London</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm z-10">
                        <Globe className="h-5 w-5 text-slate-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-sm font-semibold text-slate-700 flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-blue-600" />
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    defaultValue="Digital marketer passionate about AI and automation. Building the future of content creation."
                    className="min-h-[120px] resize-none bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base shadow-sm hover:shadow-md"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 border-2 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 font-semibold px-8"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-100/50">
                <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <Twitter className="h-6 w-6 text-blue-500" />
                  <span>Twitter Connection</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Manage your connected Twitter account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-4 sm:px-6 py-6">
                {twitterStatus.connected ? (
                  // Connected state
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-6 border rounded-xl space-y-4 sm:space-y-0 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-4 ring-white shadow-lg">
                            <AvatarImage 
                              src={twitterStatus.profileImageUrl || (twitterStatus.username ? `https://unavatar.io/twitter/${twitterStatus.username}` : "/placeholder.svg")} 
                              alt={`@${twitterStatus.username || 'Twitter'} profile`} 
                              className="object-cover"
                              onError={(e) => {
                                // Fallback to unavatar.io if the image fails to load
                                const target = e.target as HTMLImageElement;
                                if (twitterStatus.username && !target.src.includes('unavatar.io')) {
                                  target.src = `https://unavatar.io/twitter/${twitterStatus.username}`;
                                } else {
                                  target.src = "/placeholder.svg";
                                }
                              }}
                            />
                            <AvatarFallback className="bg-blue-500 text-white text-xl">@</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-bold text-xl text-gray-900">
                              @{twitterStatus.username || "twitter_user"}
                            </p>
                            <Badge className="bg-green-100 text-green-800 border-green-200 px-2 py-1 rounded-full">
                              ✓ Verified
                            </Badge>
                          </div>
                          <p className="text-base text-green-700 font-medium">Successfully connected & verified</p>
                          <p className="text-sm text-gray-600 mt-1">Your AI can now create content for this account</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge variant="default" className="text-xs px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md rounded-full">
                          🚀 AI Ready
                        </Badge>
                        <p className="text-xs text-center text-gray-500">Last verified today</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button 
                        variant="outline" 
                        className="h-12 bg-white border-blue-200 text-blue-600 hover:bg-blue-50 shadow-sm rounded-lg transition-all duration-300 font-medium"
                        onClick={refreshTwitterStatus}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh Status</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm rounded-lg transition-all duration-300 font-medium"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12a2 2 0 100-4 2 2 0 000 4zm2-5a2 2 0 11-4 0 2 2 0 014 0zm4 6a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Settings</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-12 bg-white border-red-200 text-red-600 hover:bg-red-50 shadow-sm rounded-lg transition-all duration-300 font-medium"
                        onClick={handleDisconnectTwitter}
                      >
                        <span>Disconnect</span>
                      </Button>
                    </div>
                  </>
                ) : showEmailVerification ? (
                  // Email verification state
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 border rounded-lg space-y-4 sm:space-y-0 bg-blue-50 border-blue-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarFallback className="bg-blue-500 text-white text-lg">@</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <p className="font-medium text-base sm:text-lg text-blue-700">Verify your email for @{twitterUsername}</p>
                          <p className="text-sm text-blue-600">Enter the email associated with your X account</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm px-3 py-1.5 text-blue-600 border-blue-300 rounded-full">
                        Step 2 of 2
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="verificationEmail" className="text-sm font-medium text-gray-700">
                          X Account Email
                        </Label>
                        <Input
                          id="verificationEmail"
                          type="email"
                          placeholder="your.email@x.com"
                          value={verificationEmail}
                          onChange={(e) => setVerificationEmail(e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                        />
                        <p className="text-xs text-gray-500">
                          Enter the email address associated with your X account for verification
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button 
                          onClick={handleSendVerificationCode}
                          disabled={isSendingCode || !verificationEmail.trim()}
                          className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg px-6 rounded-lg transition-all duration-300 font-medium"
                        >
                          {isSendingCode ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <span>Sending Code...</span>
                            </>
                          ) : (
                            <span>Send Verification Code</span>
                          )}
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="verificationCode" className="text-sm font-medium text-gray-700">
                          Verification Code
                        </Label>
                        <Input
                          id="verificationCode"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                        />
                        <p className="text-xs text-gray-500">
                          Check your email for the verification code we sent
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button 
                          onClick={handleVerifyCode}
                          disabled={isVerifyingCode || !verificationCode.trim()}
                          className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg px-6 rounded-lg transition-all duration-300 font-medium"
                        >
                          {isVerifyingCode ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <span>Verifying...</span>
                            </>
                          ) : (
                            <span>Verify & Connect</span>
                          )}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setShowEmailVerification(false)
                            setVerificationEmail('')
                            setVerificationCode('')
                          }}
                          className="h-12 border-gray-300 hover:bg-gray-50 rounded-lg transition-all duration-300 font-medium"
                        >
                          <span>Back</span>
                        </Button>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Note:</span> We'll send a verification code to your email. 
                            This helps us confirm you own the X account.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Not connected state
                  <>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-5 border rounded-lg space-y-4 sm:space-y-0 bg-gray-50 border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                          <AvatarFallback className="bg-gray-300 text-gray-600 text-lg">@</AvatarFallback>
                        </Avatar>
                        <div className="text-center sm:text-left">
                          <p className="font-medium text-base sm:text-lg text-gray-700">No account connected</p>
                          <p className="text-sm text-gray-500">Connect your Twitter account to get started</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-sm px-3 py-1.5 text-gray-500 border-gray-300 rounded-full">
                        Not Connected
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <div className="relative flex-1">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400 text-base">@</span>
                          </div>
                          <Input
                            placeholder="your_twitter_username"
                            value={twitterUsername}
                            onChange={(e) => setTwitterUsername(e.target.value.replace('@', ''))}
                            className="pl-8 h-12 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-300"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleConnectTwitter()
                              }
                            }}
                          />
                        </div>
                        <Button 
                          onClick={handleConnectTwitter}
                          disabled={isConnectingTwitter || !twitterUsername.trim()}
                          className="h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg px-6 rounded-lg transition-all duration-300 font-medium"
                        >
                          {isConnectingTwitter ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <Twitter className="h-4 w-4 mr-2" />
                              <span>Connect Account</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-sm text-blue-700">
                            <span className="font-medium">Note:</span> We'll verify your username exists on Twitter before connecting. 
                            Your account must be public for verification.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
              <CardHeader className="px-4 sm:px-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm border-b border-gray-100/50">
                <CardTitle className="flex items-center space-x-2 text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Account Security</span>
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Manage your account security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-blue-100 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Two-Factor Authentication</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1">Enabled</Badge>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Active Sessions</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Manage devices connected to your account</p>
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1">2 Active</Badge>
                  </div>
                  
                  <div className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-purple-100 rounded-xl">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <h4 className="font-semibold text-gray-900">Password</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Last changed 3 months ago</p>
                    <Button variant="outline" size="sm" className="h-9 text-xs rounded-lg px-3">
                      Update
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    variant="destructive" 
                    className="w-full sm:w-auto h-12 bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg font-medium px-6" 
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout Account</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6 sm:space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Account Settings
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Manage your account preferences and general settings
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Email Notifications</Label>
                          <p className="text-sm text-slate-600 mt-1">Receive email updates about your account</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Marketing Emails</Label>
                          <p className="text-sm text-slate-600 mt-1">Receive emails about new features and tips</p>
                        </div>
                      </div>
                      <Switch className="scale-125" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-green-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Public Profile</Label>
                          <p className="text-sm text-slate-600 mt-1">Make your profile visible to others</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-orange-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                          <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">AI Features</Label>
                          <p className="text-sm text-slate-600 mt-1">Enable AI-powered content suggestions</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Account Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 border-2 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 font-semibold px-8"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 sm:space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Bell className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Notification Preferences
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Customize how you receive notifications and alerts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Email Notifications</Label>
                          <p className="text-sm text-slate-600 mt-1">Receive email updates about your account activity</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                        className="scale-125"
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-green-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                          <Smartphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Push Notifications</Label>
                          <p className="text-sm text-slate-600 mt-1">Receive push notifications on your devices</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                        className="scale-125"
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                          <Heart className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Engagement Alerts</Label>
                          <p className="text-sm text-slate-600 mt-1">Get notified about likes, comments, and shares</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.engagement}
                        onCheckedChange={(checked) => setNotifications({...notifications, engagement: checked})}
                        className="scale-125"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-orange-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                          <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Follower Notifications</Label>
                          <p className="text-sm text-slate-600 mt-1">Receive alerts when someone follows you</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.followers}
                        onCheckedChange={(checked) => setNotifications({...notifications, followers: checked})}
                        className="scale-125"
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-pink-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-md">
                          <AtSign className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Mentions</Label>
                          <p className="text-sm text-slate-600 mt-1">Get notified when you're mentioned in posts</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.mentions}
                        onCheckedChange={(checked) => setNotifications({...notifications, mentions: checked})}
                        className="scale-125"
                      />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                          <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Direct Messages</Label>
                          <p className="text-sm text-slate-600 mt-1">Receive alerts for new direct messages</p>
                        </div>
                      </div>
                      <Switch
                        checked={notifications.directMessages}
                        onCheckedChange={(checked) => setNotifications({...notifications, directMessages: checked})}
                        className="scale-125"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Notification Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 border-2 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 font-semibold px-8"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Notification Schedule
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Control when you receive notifications
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                        <Clock className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Label className="text-lg font-semibold text-slate-800">Quiet Hours</Label>
                        <p className="text-sm text-slate-600 mt-1">Pause notifications during specified hours</p>
                      </div>
                    </div>
                    <Switch className="scale-125" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-16">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        Start Time
                      </Label>
                      <div className="relative group">
                        <Input
                          type="time"
                          defaultValue="22:00"
                          className="h-14 pl-12 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm">
                          <Clock className="h-5 w-5 text-slate-500" />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                        End Time
                      </Label>
                      <div className="relative group">
                        <Input
                          type="time"
                          defaultValue="08:00"
                          className="h-14 pl-12 bg-slate-50/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md"
                        />
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-lg shadow-sm">
                          <Clock className="h-5 w-5 text-slate-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-green-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                        <Calendar className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <Label className="text-lg font-semibold text-slate-800">Weekend Notifications</Label>
                        <p className="text-sm text-slate-600 mt-1">Receive notifications during weekends</p>
                      </div>
                    </div>
                    <Switch defaultChecked className="scale-125" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Schedule Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6 sm:space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Bot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Automation Settings
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Configure your automated posting and content scheduling preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                          <Zap className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Auto Posting</Label>
                          <p className="text-sm text-slate-600 mt-1">Automatically post content to your Twitter account</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-green-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                          <Clock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Optimal Times</Label>
                          <p className="text-sm text-slate-600 mt-1">Post content at optimal times for engagement</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                          <Globe className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Timezone</Label>
                          <p className="text-sm text-slate-600 mt-1">Select your timezone for optimal posting times</p>
                        </div>
                      </div>
                      <Select defaultValue="america-new-york">
                        <SelectTrigger className="w-full h-12 bg-white/80 border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="america-new-york">America/New York</SelectItem>
                          <SelectItem value="america-los-angeles">America/Los Angeles</SelectItem>
                          <SelectItem value="europe-london">Europe/London</SelectItem>
                          <SelectItem value="asia-tokyo">Asia/Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-orange-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Weekends Only</Label>
                          <p className="text-sm text-slate-600 mt-1">Post content only on weekends</p>
                        </div>
                      </div>
                      <Switch className="scale-125" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Automation Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 border-2 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 font-semibold px-8"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6 sm:space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Billing & Subscription
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Manage your subscription plan, payment methods, and billing preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                          <Crown className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Subscription Plan</Label>
                          <p className="text-sm text-slate-600 mt-1">Choose your subscription plan</p>
                        </div>
                      </div>
                      <Select defaultValue="pro">
                        <SelectTrigger className="w-full h-12 bg-white/80 border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-green-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Payment Method</Label>
                          <p className="text-sm text-slate-600 mt-1">Choose your payment method</p>
                        </div>
                      </div>
                      <Select defaultValue="credit-card">
                        <SelectTrigger className="w-full h-12 bg-white/80 border-2 border-slate-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Invoice Frequency</Label>
                          <p className="text-sm text-slate-600 mt-1">Choose how often you receive invoices</p>
                        </div>
                      </div>
                      <Select defaultValue="monthly">
                        <SelectTrigger className="w-full h-12 bg-white/80 border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all duration-300 text-base font-medium shadow-sm hover:shadow-md">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annually">Annually</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-orange-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                          <Download className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Billing History</Label>
                          <p className="text-sm text-slate-600 mt-1">Download your billing history and invoices</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-12 px-6 rounded-lg border-slate-300 hover:bg-slate-50 transition-all duration-300">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Billing Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-14 border-2 border-slate-300 hover:bg-slate-50 rounded-xl transition-all duration-300 font-semibold px-8"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 sm:space-y-8">
            <Card className="group hover:shadow-2xl transition-all duration-500 shadow-xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/20">
              <CardHeader className="px-6 sm:px-8 py-8 bg-gradient-to-r from-blue-50/90 via-purple-50/80 to-pink-50/70 backdrop-blur-xl border-b border-white/30">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Security Settings
                    </CardTitle>
                    <CardDescription className="text-base text-slate-600 mt-1">
                      Manage your account security and privacy preferences
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-8 px-6 sm:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Two-Factor Authentication</Label>
                          <p className="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-green-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                          <Monitor className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Active Sessions</Label>
                          <p className="text-sm text-slate-600 mt-1">Manage devices connected to your account</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1">2 Active</Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-purple-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Login Notifications</Label>
                          <p className="text-sm text-slate-600 mt-1">Get notified of new login attempts</p>
                        </div>
                      </div>
                      <Switch defaultChecked className="scale-125" />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-orange-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                          <Key className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Password</Label>
                          <p className="text-sm text-slate-600 mt-1">Last changed 3 months ago</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg border-slate-300 hover:bg-slate-50 transition-all duration-300">
                        Update
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-pink-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl shadow-md">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Privacy Mode</Label>
                          <p className="text-sm text-slate-600 mt-1">Hide your activity from other users</p>
                        </div>
                      </div>
                      <Switch className="scale-125" />
                    </div>

                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-50 to-indigo-50/50 rounded-2xl border border-slate-200/50 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md">
                          <Trash2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <Label className="text-lg font-semibold text-slate-800">Data Export</Label>
                          <p className="text-sm text-slate-600 mt-1">Download your account data</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="h-10 px-4 rounded-lg border-slate-300 hover:bg-slate-50 transition-all duration-300">
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200/50">
                  <Button className="w-full sm:w-auto h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold px-8 text-white">
                    <Save className="h-5 w-5 mr-2" />
                    Save Security Settings
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full sm:w-auto h-14 border-2 border-red-300 hover:bg-red-50 rounded-xl transition-all duration-300 font-semibold px-8"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout All Devices
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
      <Toaster />
    </div>
  )
}

