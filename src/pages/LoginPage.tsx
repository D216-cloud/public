import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Twitter, ArrowLeft, CheckCircle, Chrome, Sparkles, TrendingUp, Clock, Users, Loader2, Wifi, ArrowRight } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

// Add Google login script
declare global {
  interface Window {
    google: any;
  }
}

// Simplified questions - only 5 core questions
const postAuthQuestions = [
  {
    id: "interests",
    title: "What are your interests?",
    subtitle: "Select all that apply to help us personalize your experience",
    type: "multiple",
    options: ["Technology", "Business", "Sports", "Entertainment", "Politics", "Science", "Art & Design"]
  },
  {
    id: "content-type",
    title: "What type of content do you prefer?",
    subtitle: "We'll tailor our suggestions to your preferences",
    type: "multiple",
    options: ["News", "Educational", "Humor", "Inspirational", "Industry Insights", "Personal Stories"]
  },
  {
    id: "posting-frequency",
    title: "How often do you want to post?",
    subtitle: "This helps us plan your content schedule",
    type: "single",
    options: ["Daily", "Every other day", "2-3 times per week", "Weekly", "Whenever I feel like it"]
  },
  {
    id: "audience",
    title: "Who is your target audience?",
    subtitle: "Understanding your audience helps us create relevant content",
    type: "multiple",
    options: ["Professionals", "Students", "Parents", "Tech Enthusiasts", "Entrepreneurs", "General Audience"]
  },
  {
    id: "goals",
    title: "What are your Twitter goals?",
    subtitle: "Select all that apply",
    type: "multiple",
    options: ["Grow followers", "Drive website traffic", "Generate leads", "Build brand awareness", "Share knowledge", "Network with professionals"]
  }
]

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [postAuthStep, setPostAuthStep] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [postAuthAnswers, setPostAuthAnswers] = useState<Record<string, string[]>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTwitterConnect, setShowTwitterConnect] = useState(false)
  const [twitterHandle, setTwitterHandle] = useState("")

  // Initialize Google login when component mounts
  useEffect(() => {
    initializeGoogleLogin();
  }, []);

  // Detect if user is on mobile
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
  };

  // Handle Google auth
  const handleGoogleAuth = () => {
    if (window.google && window.google.accounts) {
      // On mobile, prefer button click over One Tap
      if (isMobile()) {
        // Trigger button click instead of One Tap
        const button = document.getElementById('google-login-button');
        if (button) {
          (button as any).click();
        } else {
          // Fallback: Initialize and then trigger
          initializeGoogleLogin();
          setTimeout(() => {
            const button = document.getElementById('google-login-button');
            if (button) {
              (button as any).click();
            }
          }, 1000);
        }
      } else {
        // On desktop, use One Tap
        window.google.accounts.id.prompt();
      }
    } else {
      // Fallback: Initialize and then trigger
      initializeGoogleLogin();
      setTimeout(() => {
        if (window.google && window.google.accounts) {
          if (isMobile()) {
            const button = document.getElementById('google-login-button');
            if (button) {
              (button as any).click();
            }
          } else {
            window.google.accounts.id.prompt();
          }
        }
      }, 1000);
    }
  }

  // Check onboarding status and redirect accordingly
  const checkOnboardingStatus = async (token: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/onboarding/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.isCompleted) {
          // Onboarding is completed, go to dashboard
          navigate("/dashboard");
        } else {
          // Onboarding not completed, go to onboarding
          navigate("/onboarding");
        }
      } else {
        // No onboarding data found, go to onboarding
        navigate("/onboarding");
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Default to onboarding if there's an error
      navigate("/onboarding");
    }
  };

  // Handle Google credential response
  const handleGoogleCredentialResponse = async (response: any) => {
    try {
      setIsLoading(true);
      setLoadingProvider("google");
      
      // Get API URL from environment variables or use default
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // For mobile testing, if API URL is localhost, try to use current host
      let finalApiUrl = apiUrl;
      if (typeof window !== 'undefined' && apiUrl.includes('localhost') && window.location.hostname !== 'localhost') {
        finalApiUrl = `${window.location.protocol}//${window.location.hostname}:5000`;
      }
      
      // Send the token to backend for verification
      const res = await fetch(`${finalApiUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tokenId: response.credential }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Store user data and token in localStorage
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        
        // Check onboarding status before redirecting
        await checkOnboardingStatus(data.token);
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
      setLoadingProvider(null);
      // Show user-friendly error message
      let errorMessage = "Authentication failed: Failed to fetch. Please try again later.";
      if (error instanceof Error) {
        if (error.message.includes("fetch") || error.message.includes("Failed to fetch")) {
          errorMessage = "Authentication failed: Network error. Please check your connection and try again.";
        } else {
          errorMessage = `Authentication failed: ${error.message}. Please try again.`;
        }
      }
      alert(errorMessage);
    }
  };

  // Initialize Google login
  const initializeGoogleLogin = () => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      console.error('Google Client ID not found. Please set VITE_GOOGLE_CLIENT_ID in your .env file');
      return;
    }
    
    // Load Google Identity Services script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleServices(googleClientId);
      };
      script.onerror = () => {
        console.error('Failed to load Google Identity Services script');
        // Show user-friendly error message
        alert('Failed to load Google authentication. Please check your internet connection and try again.');
      };
      document.head.appendChild(script);
    } else {
      initializeGoogleServices(googleClientId);
    }
  };

  // Initialize Google Services
  const initializeGoogleServices = (googleClientId: string) => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
        auto_select: false, // Don't auto-select accounts
        cancel_on_tap_outside: false,
        ux_mode: 'redirect', // Use redirect mode for better compatibility
        context: 'signin',
      });
      
      // Render the Google Sign-In button
      window.google.accounts.id.renderButton(
        document.getElementById("google-login-button"),
        { 
          theme: "outline", 
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: "100%",
          logo_alignment: "center",
        }
      );
      
      // Disable One Tap completely for better mobile compatibility
      // window.google.accounts.id.prompt(); // Removed for mobile compatibility
    }
  };

  const handlePostAuthNext = () => {
    // Save current answers
    const currentQuestion = postAuthQuestions[postAuthStep - 1]
    setPostAuthAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOptions
    }))

    if (postAuthStep < postAuthQuestions.length) {
      setSelectedOptions([]) // Reset for next question
      setPostAuthStep(postAuthStep + 1)
    } else {
      // Finished all questions, show loading and then Twitter connect
      setSelectedOptions([]) // Reset for next question
      setPostAuthStep(0) // Reset step
      setIsProcessing(true)
      
      // Simulate processing
      setTimeout(() => {
        setIsProcessing(false)
        setShowTwitterConnect(true)
      }, 3000)
    }
  }

  const handlePostAuthBack = () => {
    if (postAuthStep > 1) {
      // Save current answers before going back
      const currentQuestion = postAuthQuestions[postAuthStep - 1]
      setPostAuthAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedOptions
      }))
      
      setSelectedOptions(postAuthAnswers[postAuthQuestions[postAuthStep - 2]?.id] || [])
      setPostAuthStep(postAuthStep - 1)
    }
  }

  const handleConnectTwitter = async () => {
    // Simulate Twitter connection
    setIsLoading(true);
    setTimeout(async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await checkOnboardingStatus(token);
      } else {
        navigate("/dashboard");
      }
    }, 2000);
  }

  // Render post-auth questions
  if (postAuthStep > 0) {
    const currentQuestion = postAuthQuestions[postAuthStep - 1]
    
    // Restore previously selected options for this question
    const restoredOptions = postAuthAnswers[currentQuestion.id] || selectedOptions

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="text-center bg-gradient-to-r from-blue-50/80 to-purple-50/80">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-center space-x-2 mb-4">
                  {postAuthQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i < postAuthStep ? "bg-gradient-to-r from-blue-500 to-purple-500 shadow-md" : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-muted-foreground">
                  Question {postAuthStep} of {postAuthQuestions.length}
                </span>
              </div>
              <CardTitle className="text-3xl text-balance mb-2">{currentQuestion.title}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {currentQuestion.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={restoredOptions.includes(option) ? "default" : "outline"}
                    className={`h-16 p-4 text-left justify-start text-base font-medium transition-all duration-200 transform hover:scale-[1.02] rounded-lg ${
                      restoredOptions.includes(option)
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                        : "hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    onClick={() => {
                      if (currentQuestion.type === "multiple") {
                        // For multiple selection
                        setSelectedOptions(prev => 
                          prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]
                        )
                      } else {
                        // For single selection
                        setSelectedOptions([option])
                      }
                      }}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex justify-between pt-8">
                <Button
                  variant="outline"
                  onClick={handlePostAuthBack}
                  disabled={postAuthStep === 1}
                  className="h-12 px-8 text-base border-2 hover:bg-gray-50 rounded-lg"
                >
                  Previous
                </Button>
                <Button
                  onClick={handlePostAuthNext}
                  disabled={selectedOptions.length === 0}
                  className="h-12 px-8 text-base bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
                >
                  {postAuthStep === postAuthQuestions.length ? "Finish Setup" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render processing/loading state
  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Setting up your account</h2>
                  <p className="text-muted-foreground">We're personalizing your experience...</p>
                </div>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full animate-pulse" style={{width: "75%"}}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Render Twitter connection section
  if (showTwitterConnect) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="text-center pb-4 bg-gradient-to-r from-blue-50/80 to-purple-50/80">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                  <Twitter className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Connect Your Twitter</CardTitle>
              <CardDescription className="text-base">Enter your Twitter handle to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 py-6">
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Wifi className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-900">Why connect Twitter?</h3>
                      <ul className="mt-2 space-y-1 text-sm text-blue-800">
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Post directly to your timeline</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Analyze your performance</span>
                        </li>
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Engage with your audience</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter-handle" className="text-base font-medium">
                    Your Twitter Handle
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">@</span>
                    </div>
                    <Input
                      id="twitter-handle"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      placeholder="username"
                      className="h-12 text-base border-2 focus:border-blue-500 transition-colors rounded-lg pl-8"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">Enter your Twitter username without the @ symbol</p>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base font-medium bg-[#1DA1F2] hover:bg-[#1a91da] text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
                onClick={handleConnectTwitter}
                disabled={isLoading || !twitterHandle.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Connecting...
                  </div>
                ) : (
                  <>
                    <Twitter className="mr-3 h-5 w-5" />
                    Connect Twitter Account
                  </>
                )}
              </Button>

              <div className="text-center">
                <Button
                  variant="ghost"
                  onClick={() => window.location.href = "/dashboard"}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip for now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-800 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <Twitter className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TwitterAI Pro
              </span>
            </div>
            <h1 className="text-3xl font-bold text-foreground text-balance mb-4">
              Welcome Back
            </h1>
            <p className="text-muted-foreground text-lg">Sign in to continue your Twitter growth journey</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription className="text-base">Access your TwitterAI Pro dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Google login button */}
              <div 
                id="google-login-button" 
                className="cursor-pointer"
                onClick={handleGoogleAuth}
              ></div>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-4 text-gray-500">Or continue with email</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Why join TwitterAI Pro?</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">AI-Powered Content</p>
                      <p className="text-xs text-gray-500">Generate engaging tweets in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100">
                        <TrendingUp className="h-3.5 w-3.5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Boost Engagement</p>
                      <p className="text-xs text-gray-500">Increase your reach by 500%</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
                        <Clock className="h-3.5 w-3.5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Save Time</p>
                      <p className="text-xs text-gray-500">Automate your posting schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100">
                        <Users className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Analyze Competitors</p>
                      <p className="text-xs text-gray-500">Stay ahead of the competition</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-medium hover:underline">
                    Sign up for free
                  </Link>
                </p>
              </div>

              <p className="text-center text-xs text-muted-foreground pt-2">
                By signing in, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}