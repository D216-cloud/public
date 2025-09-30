"use client"
// Twitter verification flow implementation
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { API_URL } from '@/utils/config';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  MessageSquare,
  Calendar,
  TrendingUp,
  Lightbulb,
  Check,
  Twitter,
  Loader2,
  CheckCircle2,
  X,
  RotateCcw,
  Building,
  Code,
  Briefcase,
  Palette,
  Heart,
  Plane,
  Utensils,
  User,
  Camera,
  Gamepad2,
  Music,
  Brain,
  Eye,
  Package,
  Clock,
  Shield,
  Mail,
  Copy
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

// Enhanced UI Constants for a more premium feel
const steps = [
  { id: 1, title: "start", description: "quick ai setup" },
  { id: 2, title: "goals", description: "your success metrics" },
  { id: 3, title: "audience", description: "who you'll reach" },
  { id: 4, title: "content", description: "what you'll create" },
  { id: 5, title: "style", description: "your unique voice" },
  { id: 6, title: "settings", description: "ai preferences" },
  { id: 7, title: "connect", description: "link your account" },
]

const goals = [
  { id: "followers", label: "grow followers", description: "build your audience organically", icon: Users },
  { id: "engagement", label: "boost engagement", description: "spark conversations", icon: MessageSquare },
  { id: "brand", label: "build brand", description: "create your unique voice", icon: Building },
  { id: "leads", label: "generate leads", description: "convert followers to customers", icon: Target },
  { id: "thought-leadership", label: "thought leadership", description: "share expert insights", icon: Brain },
  { id: "community", label: "build community", description: "create lasting connections", icon: Users },
]

const niches = [
  { id: "tech", label: "technology", icon: Code, color: "from-blue-500 to-blue-600" },
  { id: "business", label: "business", icon: Briefcase, color: "from-emerald-500 to-emerald-600" },
  { id: "design", label: "design", icon: Palette, color: "from-pink-500 to-pink-600" },
  { id: "marketing", label: "marketing", icon: Target, color: "from-orange-500 to-orange-600" },
  { id: "lifestyle", label: "lifestyle", icon: Heart, color: "from-rose-500 to-rose-600" },
  { id: "travel", label: "travel", icon: Plane, color: "from-indigo-500 to-indigo-600" },
  { id: "food", label: "food", icon: Utensils, color: "from-amber-500 to-amber-600" },
  { id: "fitness", label: "fitness", icon: User, color: "from-green-500 to-green-600" },
  { id: "photography", label: "photography", icon: Camera, color: "from-purple-500 to-purple-600" },
  { id: "gaming", label: "gaming", icon: Gamepad2, color: "from-violet-500 to-violet-600" },
  { id: "music", label: "music", icon: Music, color: "from-sky-500 to-sky-600" },
  { id: "other", label: "other", icon: Sparkles, color: "from-gray-500 to-gray-600" },
]

const contentTypes = [
  { id: "tips", label: "quick tips", icon: Brain },
  { id: "personal", label: "personal stories", icon: Heart },
  { id: "industry", label: "industry updates", icon: TrendingUp },
  { id: "behind-scenes", label: "behind the scenes", icon: Eye },
  { id: "educational", label: "learning content", icon: Brain },
  { id: "motivational", label: "inspiring quotes", icon: TrendingUp },
  { id: "humor", label: "funny moments", icon: Sparkles },
  { id: "product", label: "product updates", icon: Package },
]

const tones = [
  { id: "professional", label: "professional", description: "clear, expert, trustworthy" },
  { id: "casual", label: "casual", description: "friendly, approachable, warm" },
  { id: "humorous", label: "humorous", description: "witty, playful, entertaining" },
  { id: "inspirational", label: "inspirational", description: "motivating, uplifting, empowering" },
]

const frequencies = [
  { id: "daily", label: "daily", description: "1 post each day" },
  { id: "frequent", label: "frequent", description: "2-3 posts daily" },
  { id: "moderate", label: "moderate", description: "3-5 posts weekly" },
  { id: "light", label: "light", description: "1-2 posts weekly" },
]

export default function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    goals: [] as string[],
    audience: '',
    niche: '',
    contentTypes: [] as string[],
    competitors: '',
    postingFrequency: '',
    tone: '',
    autoPosting: false,
    twitterConnected: false,
    twitterHandle: '',
    isCompleted: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [twitterAuthStep, setTwitterAuthStep] = useState<'idle' | 'authorizing' | 'success' | 'error'>('idle');
  const [showSuccess, setShowSuccess] = useState(false);
  // States for Twitter connection flow (matching Settings page)
  const [twitterUsername, setTwitterUsername] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const progress = (currentStep / steps.length) * 100;

  // Load existing onboarding data if available
  useEffect(() => {
    const loadOnboardingData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        const response = await fetch(`${API_URL}/api/onboarding/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            const data = result.data
            setFormData({
              goals: data.goals || [],
              audience: data.audience || "",
              niche: data.niche || "",
              contentTypes: data.contentTypes || [],
              competitors: data.competitors || "",
              postingFrequency: data.postingFrequency || "",
              tone: data.tone || "",
              autoPosting: data.autoPosting || false,
              twitterConnected: data.twitterConnected || false,
              twitterHandle: data.twitterHandle || "",
              isCompleted: data.isCompleted || false
            })
            // If onboarding is already completed, redirect to dashboard
            if (data.isCompleted) {
              console.log('Onboarding already completed, redirecting to dashboard')
              navigate('/dashboard', { replace: true })
              return // Exit early to prevent further processing
            }
          }
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error)
      }
    }
    loadOnboardingData()
  }, [navigate])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [])

  // Handle Twitter connection (matching Settings page)
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

  // Send verification code to email (matching Settings page)
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

  // Verify the code sent to email (matching Settings page)
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
          const updatedFormData = {
            ...formData,
            twitterConnected: true,
            twitterHandle: twitterUsername.trim()
          }
          setFormData(updatedFormData)
          await saveProgress(updatedFormData)
          
          setShowEmailVerification(false)
          setVerificationEmail('')
          setVerificationCode('')
          toast({
            title: "Connected Successfully",
            description: `Connected to @${twitterUsername.trim()} and verified your email!`
          })
          
          // Move to next step or complete onboarding
          setTimeout(() => {
            if (currentStep < steps.length) {
              setCurrentStep(currentStep + 1)
            } else {
              completeOnboarding()
            }
          }, 1500)
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

  // Handle Twitter OAuth callback parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const twitterConnected = searchParams.get('twitterConnected');
    const error = searchParams.get('error');
    const screenName = searchParams.get('screenName');
    
    if (twitterConnected !== null) {
      if (twitterConnected === 'true' && screenName) {
        // Twitter connection successful
        const updatedFormData = {
          ...formData,
          twitterConnected: true,
          twitterHandle: screenName
        };
        setFormData(updatedFormData);
        toast({
          title: "Twitter Connected Successfully",
          description: `Your Twitter account @${screenName} has been connected.`,
        });
        
        // Save the updated form data
        saveProgress(updatedFormData).then(() => {
          // Move to next step or complete onboarding
          if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
          } else {
            completeOnboarding();
          }
        });
      } else if (twitterConnected === 'false' && error) {
        // Twitter connection failed
        setTwitterAuthStep('error');
        toast({
          title: "Twitter Connection Failed",
          description: error,
          variant: "destructive"
        });
      }
      
      // Remove query parameters from URL
      navigate('/onboarding', { replace: true });
    }
  }, [location, navigate, toast, formData, currentStep]);

  // Debounced save function to prevent multiple API calls
  const debouncedSave = useCallback(
    (dataToSave: typeof formData) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      // Set new timeout
      saveTimeoutRef.current = setTimeout(async () => {
        await saveProgress(dataToSave)
      }, 1000) // Wait 1 second after last change
    },
    []
  )

  // Save progress automatically
  const saveProgress = async (stepData = {}) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.log('No token found, skipping save')
        return
      }
      const dataToSave = { ...formData, ...stepData }
      console.log('Saving onboarding data:', dataToSave)
      const response = await fetch(`${API_URL}/api/onboarding/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSave)
      })
      const result = await response.json()
      console.log('Save response:', result)
      if (result.success) {
        console.log('✅ Progress saved successfully')
      } else {
        console.error('❌ Failed to save progress:', result.message)
      }
    } catch (error) {
      console.error('❌ Error saving progress:', error)
    }
  }

  const handleNext = async () => {
    // Validate current step before proceeding
    const isValid = validateCurrentStep()
    if (!isValid) {
      return
    }
    setIsLoading(true)
    // Save current step data
    await saveProgress()
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      await completeOnboarding()
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 400)
  }

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 2: // Goals step
        if (formData.goals.length === 0) {
          toast({
            title: "select at least one goal",
            description: "choose what success looks like for you",
            variant: "destructive"
          })
          return false
        }
        break
      case 3: // Audience step
        if (!formData.niche) {
          toast({
            title: "choose your niche",
            description: "this helps us understand your world",
            variant: "destructive"
          })
          return false
        }
        break
      case 4: // Content step
        if (formData.contentTypes.length === 0) {
          toast({
            title: "pick your content types",
            description: "these shape your ai's creativity",
            variant: "destructive"
          })
          return false
        }
        break
      case 6: // Preferences step
        if (!formData.postingFrequency || !formData.tone) {
          toast({
            title: "complete your preferences",
            description: "set your rhythm and voice",
            variant: "destructive"
          })
          return false
        }
        break
      case 7: // Connect step
        if (!formData.twitterConnected || !formData.twitterHandle) {
          // This will be handled in the UI flow itself
          return true
        }
        break
      default:
        break
    }
    return true
  }

  const completeOnboarding = async () => {
    try {
      setIsSaving(true)
      const token = localStorage.getItem('token')
      console.log('Completing onboarding with final data:', formData)
      // Save final data with completion flag
      const saveResponse = await fetch(`${API_URL}/api/onboarding/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...formData, isCompleted: true })
      })
      const saveResult = await saveResponse.json()
      console.log('Save final data response:', saveResult)
      // Mark as completed
      const completeResponse = await fetch(`${API_URL}/api/onboarding/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      const completeResult = await completeResponse.json()
      console.log('Complete onboarding response:', completeResult)
      if (completeResult.success) {
        // Clear any existing onboarding data to prevent loops
        localStorage.removeItem('onboarding_data')
        // Force auth recheck to update onboarding status
        localStorage.setItem('forceAuthRecheck', 'true')
        toast({
          title: "🚀 ready to grow!",
          description: "launching your ai dashboard...",
        })
        // Immediate redirect to prevent loops
        navigate('/dashboard')
      } else {
        const errorMessage = typeof completeResult.message === 'string' ? completeResult.message : 'Failed to complete onboarding'
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error('Error completing onboarding:', error)
      const errorMessage = error instanceof Error ? error.message : 'There was an error completing your onboarding. Please try again.'
      toast({
        title: "setup incomplete",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleGoalToggle = async (goalId: string) => {
    const updatedGoals = formData.goals.includes(goalId)
      ? formData.goals.filter((g) => g !== goalId)
      : [...formData.goals, goalId]
    const updatedFormData = { ...formData, goals: updatedGoals }
    setFormData(updatedFormData)
    // Use debounced save to prevent multiple calls
    debouncedSave(updatedFormData)
  }

  const handleContentTypeToggle = async (typeId: string) => {
    const updatedContentTypes = formData.contentTypes.includes(typeId)
      ? formData.contentTypes.filter((t) => t !== typeId)
      : [...formData.contentTypes, typeId]
    const updatedFormData = { ...formData, contentTypes: updatedContentTypes }
    setFormData(updatedFormData)
    // Use debounced save to prevent multiple calls
    debouncedSave(updatedFormData)
  }

  // Fix the stepVariants to use proper types
  const stepVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3,
        type: "spring"
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const renderStep = () => {
    const handleSendCode = async () => {
      if (!formData.twitterHandle.trim()) {
      toast({
        title: "Handle required",
        description: "Please enter your Twitter handle",
        variant: "destructive"
      })
      return
      }

      setTwitterAuthStep('authorizing')
      try {
      const token = localStorage.getItem('token')
      if (!token) return

      // Verify Twitter username exists
      const verifyResponse = await fetch(`${API_URL}/api/twitter/verify-username`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: formData.twitterHandle.trim() })
      })

      const verifyResult = await verifyResponse.json()

      if (!verifyResult.success) {
        setTwitterAuthStep('error')
        toast({
        title: "Verification failed",
        description: verifyResult.message || "Please check your Twitter handle",
        variant: "destructive"
        })
        return
      }

      // Send verification code (assuming API endpoint exists for direct code sending)
      const sendResponse = await fetch(`${API_URL}/api/twitter/send-direct-code`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: formData.twitterHandle.trim() })
      })

      const sendResult = await sendResponse.json()

      if (sendResult.success) {
        setTwitterAuthStep('success')
        const updatedFormData = {
        ...formData,
        twitterConnected: true,
        twitterHandle: formData.twitterHandle.trim()
        }
        setFormData(updatedFormData)
        await saveProgress(updatedFormData)
        toast({
        title: "Code sent",
        description: "Verification code sent to your Twitter account"
        })
      } else {
        setTwitterAuthStep('error')
        toast({
        title: "Failed to send code",
        description: sendResult.message || "Please try again",
        variant: "destructive"
        })
      }
      } catch (error) {
      setTwitterAuthStep('error')
      console.error('Error sending verification code:', error)
      toast({
        title: "Error",
        description: "Failed to send verification code",
        variant: "destructive"
      })
      }
    }
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          {currentStep === 1 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-8"
            >
              <motion.div
                className="flex justify-center"
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.2
                }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 shadow-2xl"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(147, 51, 234, 0.7)",
                        "0 0 0 0 rgba(147, 51, 234, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Twitter className="h-14 w-14 text-white drop-shadow-lg" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-1 -right-1 h-7 w-7 bg-emerald-400 rounded-full flex items-center justify-center shadow-md"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{
                      scale: 1,
                      rotate: 360
                    }}
                    transition={{
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.4
                    }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div className="space-y-3" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight tracking-tight"
                  initial={{ y: 10 }}
                  animate={{ y: 0 }}
                >
                  AI-Powered X Growth
                </motion.h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  In just a few minutes, we'll create your personalized AI strategy for explosive engagement and organic growth.
                </p>
              </motion.div>
              <motion.div
                className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5 text-blue-500" />
                  </motion.div>
                  <span className="text-sm text-gray-700 font-semibold tracking-wide">YOUR AI BLUEPRINT</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  We'll learn your goals, audience, and style to create content that feels authentically you — and drives real results.
                </p>
              </motion.div>
              <motion.div
                className="grid grid-cols-3 gap-5 max-w-md mx-auto"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {[
                  { icon: Target, label: "Set Goals", color: "bg-blue-100 text-blue-600" },
                  { icon: Users, label: "Know Audience", color: "bg-purple-100 text-purple-600" },
                  { icon: Clock, label: "Grow Smart", color: "bg-emerald-100 text-emerald-600" }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ y: 10 }}
                      whileHover={{ y: -4, scale: 1.07 }}
                      transition={{ type: "spring", stiffness: 350, damping: 15 }}
                    >
                      <div className={`h-14 w-14 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
                        <Icon className="h-7 w-7" />
                      </div>
                      <p className="text-xs font-medium text-gray-700 tracking-wide">{item.label}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">What does success look like for you?</h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Select what matters most — we'll build your entire strategy around it.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {goals.map((goal, index) => {
                  const Icon = goal.icon
                  const isSelected = formData.goals.includes(goal.id)
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-5 rounded-xl cursor-pointer relative overflow-hidden group transition-all duration-300 border-2 ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-md" 
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                      onClick={() => handleGoalToggle(goal.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent h-1 top-0"
                        initial={false}
                        animate={{ x: isSelected ? "-100%" : "100%" }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                      />
                      <div className="relative flex items-start space-x-4">
                        <motion.div
                          animate={{ scale: isSelected ? 1.15 : 1, rotate: isSelected ? 8 : 0 }}
                          transition={{ type: "spring", stiffness: 450, damping: 20 }}
                        >
                          <Icon className={`h-6 w-6 mt-0.5 flex-shrink-0 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-800 leading-tight">{goal.label}</h3>
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{goal.description}</p>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                          >
                            <CheckCircle2 className="h-6 w-6 text-blue-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {formData.goals.length > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-blue-600 font-semibold tracking-wide"
                >
                  ✨ {formData.goals.length} goal{formData.goals.length > 1 ? 's' : ''} selected — perfect!
                </motion.p>
              )}
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">Who are you creating for?</h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">This helps your AI speak their language and resonate deeply.</p>
              </div>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Your World</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {niches.map((niche, index) => {
                      const Icon = niche.icon
                      const isSelected = formData.niche === niche.id
                      return (
                        <motion.div
                          key={niche.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03 }}
                          className={`p-4 rounded-xl cursor-pointer text-center group transition-all duration-300 transform ${
                            isSelected
                              ? `bg-gradient-to-br ${niche.color} text-white shadow-lg scale-105` 
                              : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md"
                          }`}
                          onClick={async () => {
                            const updatedFormData = { ...formData, niche: niche.id }
                            setFormData(updatedFormData)
                            debouncedSave(updatedFormData)
                          }}
                          whileHover={{ y: -3, scale: isSelected ? 1.08 : 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div
                            animate={{ rotate: isSelected ? 8 : 0 }}
                            transition={{ type: "spring", stiffness: 350 }}
                          >
                            <Icon
                              className={`h-7 w-7 mx-auto mb-3 ${isSelected ? "text-white drop-shadow-lg" : "text-gray-500"}`}
                            />
                          </motion.div>
                          <p className="text-sm font-medium tracking-wide">{niche.label}</p>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="audience" className="text-sm font-medium text-gray-700">Dream Audience</Label>
                  <motion.div
                    initial={false}
                    whileFocus={{ scale: 1.02 }}
                  >
                    <Textarea
                      id="audience"
                      placeholder="Who lights up when they see your content? Ambitious creators? Tech enthusiasts? Wellness seekers?..."
                      value={formData.audience}
                      onChange={async (e) => {
                        const updatedFormData = { ...formData, audience: e.target.value }
                        setFormData(updatedFormData)
                        debouncedSave(updatedFormData)
                      }}
                      rows={4}
                      className="resize-none text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0 placeholder:text-gray-400 border-gray-200"
                    />
                  </motion.div>
                  <p className="text-xs text-gray-500 pl-1 italic">
                    Be specific — this is the secret sauce for your AI's content magic.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">What content feels like you?</h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Pick what your AI should create most — your authentic style.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {contentTypes.map((type, index) => {
                  const isSelected = formData.contentTypes.includes(type.id)
                  return (
                    <motion.div
                      key={type.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl cursor-pointer group transition-all duration-300 border-2 ${
                        isSelected
                          ? "bg-blue-50 border-blue-300 shadow-md" 
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      }`}
                      onClick={() => handleContentTypeToggle(type.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-6 w-6 rounded-md ${isSelected ? 'bg-blue-500' : 'bg-gray-200'} flex-shrink-0`} />
                          <span className="text-base font-medium text-gray-800">{type.label}</span>
                        </div>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 450, damping: 20 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-blue-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
              {formData.contentTypes.length > 0 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-blue-600 font-semibold tracking-wide"
                >
                  🎯 {formData.contentTypes.length} type{formData.contentTypes.length > 1 ? 's' : ''} locked in — looking great!
                </motion.p>
              )}
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">What voices inspire you?</h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Share what you love — we'll blend it into your unique AI voice.</p>
              </div>
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="competitors" className="text-sm font-medium text-gray-700">Favorite Creators or Styles</Label>
                  <motion.div initial={false} whileFocus={{ scale: 1.02 }}>
                    <Textarea
                      id="competitors"
                      placeholder="@naval's wisdom threads, @levelsio's raw honesty, or just 'clear tech explanations with personality'..."
                      value={formData.competitors}
                      onChange={async (e) => {
                        const updatedFormData = { ...formData, competitors: e.target.value }
                        setFormData(updatedFormData)
                        debouncedSave(updatedFormData)
                      }}
                      rows={4}
                      className="resize-none text-sm transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0 placeholder:text-gray-400 border-gray-200"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center space-x-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg"
                  >
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Private & Secure — just helps your AI find your authentic voice.</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
          {currentStep === 6 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">Fine-Tune Your AI</h2>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">Set the perfect rhythm and personality for your content engine.</p>
              </div>
              <div className="space-y-6">
                <motion.div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <span>Posting Rhythm</span>
                  </Label>
                  <RadioGroup
                    value={formData.postingFrequency}
                    onValueChange={async (value) => {
                      const updatedFormData = { ...formData, postingFrequency: value }
                      setFormData(updatedFormData)
                      await saveProgress(updatedFormData)
                    }}
                    className="space-y-3"
                  >
                    {frequencies.map((freq, index) => (
                      <motion.div
                        key={freq.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-md"
                        whileHover={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem value={freq.id} id={freq.id} className="h-5 w-5" />
                          <Label htmlFor={freq.id} className="cursor-pointer flex-1">
                            <div className="text-base font-semibold text-gray-800">{freq.label}</div>
                            <div className="text-sm text-gray-500">{freq.description}</div>
                          </Label>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </motion.div>
                <motion.div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                    <Palette className="h-5 w-5 text-blue-500" />
                    <span>AI Personality</span>
                  </Label>
                  <RadioGroup
                    value={formData.tone}
                    onValueChange={async (value) => {
                      const updatedFormData = { ...formData, tone: value }
                      setFormData(updatedFormData)
                      await saveProgress(updatedFormData)
                    }}
                    className="space-y-3"
                  >
                    {tones.map((tone, index) => (
                      <motion.div
                        key={tone.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-md"
                        whileHover={{ backgroundColor: "#f8fafc" }}
                      >
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem value={tone.id} id={tone.id} className="h-5 w-5" />
                          <Label htmlFor={tone.id} className="cursor-pointer flex-1">
                            <div className="text-base font-semibold text-gray-800">{tone.label}</div>
                            <div className="text-sm text-gray-500">{tone.description}</div>
                          </Label>
                        </div>
                      </motion.div>
                    ))}
                  </RadioGroup>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer hover:shadow-md"
                  whileHover={{ backgroundColor: "#f8fafc" }}
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      id="autoPosting"
                      checked={formData.autoPosting}
                      onCheckedChange={async (checked) => {
                        const updatedFormData = { ...formData, autoPosting: checked as boolean }
                        setFormData(updatedFormData)
                        await saveProgress(updatedFormData)
                      }}
                      className="h-5 w-5"
                    />
                    <Label htmlFor="autoPosting" className="cursor-pointer text-base font-semibold text-gray-800 flex-1 flex items-center space-x-3">
                      <Lightbulb className="h-5 w-5 text-blue-500" />
                      <span>Enable AI Auto-Posting</span>
                      <Badge variant="outline" className="text-xs ml-auto bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border-purple-300 px-3 py-1 font-medium">
                        PRO FEATURE
                      </Badge>
                    </Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 ml-10">Post at scientifically optimal times for maximum engagement — completely hands-free.</p>
                </motion.div>
              </div>
            </motion.div>
          )}
          {currentStep === 7 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 leading-tight">Connect Your X Account</h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  Connect your X account to start generating content. We'll verify your account directly without OAuth.
                </p>
              </div>

              <div className="space-y-6 max-w-md mx-auto">
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
                    {showEmailVerification ? (
                      // Email verification form
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 mb-4">
                            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">@</AvatarFallback>
                            </Avatar>
                            <div className="text-center sm:text-left">
                              <p className="font-medium text-base sm:text-lg text-gray-900">@{twitterUsername}</p>
                              <p className="text-sm text-gray-500">Twitter account verified</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="verificationEmail" className="text-sm font-medium text-gray-700">
                              Email Address
                            </Label>
                            <Input
                              id="verificationEmail"
                              type="email"
                              placeholder="your.email@domain.com"
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
              </div>
            </motion.div>
          )}
          {currentStep === 8 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6 text-center"
            >
              <motion.h2
                className="text-2xl font-semibold text-gray-800 leading-tight"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
              >
                Connect Your X Account
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-gray-500 max-w-md mx-auto"
              >
                Enter your X handle to connect your account directly. We'll verify your account and start generating content.
              </motion.p>
              <motion.div
                className="relative w-40 h-40 mx-auto mb-8"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl"
                  animate={{
                    rotate: 360,
                    scale: twitterAuthStep === 'success' ? 1.15 : 1
                  }}
                  transition={{
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 0.5, ease: "easeOut" }
                  }}
                />
                <motion.div
                  className="absolute inset-4 flex items-center justify-center bg-white/95 rounded-full shadow-inner"
                  animate={{
                    backgroundColor: twitterAuthStep === 'success' ? "#f0fdf4" : "white"
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {twitterAuthStep === 'success' ? (
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 animate-pulse" />
                  ) : (
                    <Twitter className="h-16 w-16 text-blue-600" />
                  )}
                </motion.div>
                {twitterAuthStep === 'success' && (
                  <motion.div
                    className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ scale: 0, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                  >
                    <Badge variant="default" className="bg-emerald-500 text-white text-sm px-4 py-1.5 font-semibold shadow-lg">
                      SUCCESSFULLY LINKED
                    </Badge>
                  </motion.div>
                )}
              </motion.div>
              <AnimatePresence mode="wait">
                {twitterAuthStep === 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-md mx-auto space-y-5"
                  >
                    <div className="space-y-3">
                      <Label htmlFor="twitterHandle" className="flex items-center justify-center space-x-2 text-sm font-medium text-gray-700">
                        <Twitter className="h-5 w-5" />
                        <span>Your X Handle</span>
                      </Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-gray-400 text-sm">@</span>
                        </div>
                        <Input
                          id="twitterHandle"
                          placeholder="yourhandle (no @ symbol needed)"
                          value={formData.twitterHandle}
                          onChange={(e) => {
                            const updatedFormData = { ...formData, twitterHandle: e.target.value }
                            setFormData(updatedFormData)
                          }}
                          className="pl-10 text-base py-3 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-0 border-gray-200"
                        />
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        Enter your X handle to connect your account directly. We'll verify your account and start generating content.
                      </p>
                    </div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleSendCode}
                        disabled={!formData.twitterHandle.trim() || isLoading}
                        className="w-full text-base py-7 text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                      >
                        <Twitter className="h-5 w-5 mr-2" />
                        Send Verification Code
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center space-x-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl"
                    >
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Direct Connection • We verify your account without OAuth</span>
                    </motion.div>
                  </motion.div>
                )}
                {twitterAuthStep === 'authorizing' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="w-full max-w-md mx-auto space-y-5"
                  >
                    <div className="flex justify-center">
                      <motion.div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-600 font-medium">Securing connection with X...</p>
                  </motion.div>
                )}
                {twitterAuthStep === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="w-full max-w-md mx-auto space-y-5"
                  >
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 350 }}
                      className="text-emerald-600 font-semibold text-center text-lg"
                    >
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-3" />
                      <p>Successfully connected to <span className="font-bold">@{formData.twitterHandle}</span></p>
                      <p className="text-sm mt-2 text-gray-600">Your account is verified and ready for AI-powered growth</p>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={() => setTwitterAuthStep('idle')}
                        variant="outline"
                        className="w-full text-base py-6 font-medium border-gray-300 hover:bg-gray-50"
                      >
                        Change Account
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
                {twitterAuthStep === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md mx-auto space-y-5"
                  >
                    <div className="flex justify-center">
                      <X className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-center text-sm text-gray-600 font-medium">Connection Failed</p>
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Button onClick={handleSendCode} className="w-full text-base py-6 font-semibold bg-red-500 hover:bg-red-600 text-white">
                          Try Again
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" onClick={() => setTwitterAuthStep('idle')} className="w-full text-base py-6 font-medium border-gray-300 hover:bg-gray-50">
                          Edit Handle
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }
  // Improve the main container layout to be more compact and visually stunning
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Updated to match login/signup style */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
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

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => window.location.href = "/"}
                className="group relative inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 overflow-hidden transform hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Back to Home</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-700 to-blue-800 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 blur" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 relative group"
              onClick={() => window.location.href = "/"}
            >
              <ArrowLeft className="h-6 w-6" />
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity duration-200 blur" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-2xl mx-auto relative z-10">
          {/* Enhanced Progress Bar with Better Typography */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600 tracking-wide">STEP {currentStep} OF {steps.length}</span>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{Math.round(progress)}% COMPLETE</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Enhanced Main Card with Better Shadow and Blur */}
          <motion.div
            className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-shadow duration-500"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Enhanced Header with Better Gradient and Spacing */}
            <div className="bg-gradient-to-r from-blue-50/60 to-purple-50/60 px-6 py-4 border-b border-white/30">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold shadow-lg">
                  {currentStep}
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800 capitalize tracking-wide">{steps[currentStep - 1].title}</p>
                  <p className="text-sm text-gray-600 italic">{steps[currentStep - 1].description}</p>
                </div>
              </div>
            </div>

            {/* Enhanced Content Padding */}
            <CardContent className="p-6">
              {renderStep()}
            </CardContent>
          </motion.div>

          {/* Enhanced Navigation with Better Spacing and Animation */}
          <motion.div
            className="flex items-center justify-between mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 1 || isLoading}
              className="text-sm px-4 py-2 h-auto text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors duration-300 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                    index + 1 <= currentStep ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={isLoading || isSaving}
              className={`text-sm px-4 py-2 h-auto font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                currentStep === steps.length
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {isLoading || isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {currentStep === steps.length ? "Launch My AI" : "Next Step"}
                  {currentStep < steps.length && !isLoading && !isSaving && <ArrowRight className="h-4 w-4 ml-2" />}
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}